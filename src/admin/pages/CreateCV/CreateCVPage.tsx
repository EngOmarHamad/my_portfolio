import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  Trash2,
  Eye,
  Loader2,
  Sparkles,
  FileText,
  Download,
  Printer,
  Upload,
  FileDown,
} from "lucide-react";
import {
  PDFDownloadLink,
  BlobProvider,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ---------- Helper functions to calculate total experience ----------
function calculateTotalExperience(
  experiences: CreateCVFormData["experience"],
): number {
  if (!experiences || experiences.length === 0) return 0;

  // دالة مساعدة لتحويل النص إلى Date، مع التعامل مع "Present" أو النص الفارغ
  const parseDate = (dateStr: string | null | undefined): Date => {
    if (!dateStr || dateStr.toLowerCase() === "present") {
      return new Date(); // اليوم
    }
    // محاولة التحويل المباشر
    let d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    // محاولة تحويل "Month YYYY"
    const parts = dateStr.trim().split(" ");
    if (parts.length === 2) {
      const month = parts[0];
      const year = parseInt(parts[1]);
      const monthIndex = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ].indexOf(month.toLowerCase());
      if (monthIndex !== -1 && !isNaN(year)) {
        return new Date(year, monthIndex, 1);
      }
    }
    // إذا فشل كل شيء، نرجع تاريخ اليوم (أو يمكن رمي خطأ)
    return new Date();
  };

  // 1. تحويل الخبرات إلى فترات (start, end)
  const intervals: { start: Date; end: Date }[] = [];
  for (const exp of experiences) {
    const start = parseDate(exp.start_date);
    let end = parseDate(exp.end_date);
    // إذا كانت النهاية قبل البداية (غير منطقي) نتجاهل
    if (end < start) continue;
    intervals.push({ start, end });
  }

  if (intervals.length === 0) return 0;

  // 2. ترتيب الفترات حسب البداية
  intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

  // 3. دمج الفترات المتداخلة
  const merged: { start: Date; end: Date }[] = [];
  let current = intervals[0];
  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    // إذا كانت بداية التالية <= نهاية الحالية => تداخل
    if (next.start <= current.end) {
      // نمدد النهاية إلى الأبعد
      if (next.end > current.end) current.end = next.end;
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  // 4. حساب إجمالي الأشهر من الفترات المدمجة
  let totalMonths = 0;
  for (const interval of merged) {
    const start = interval.start;
    const end = interval.end;
    // إذا كان يوم النهاية أكبر من أو يساوي يوم البداية، نضيف شهرًا إضافيًا؟
    // الأفضل عدم إضافة شهر إضافي بل اعتبار أن الشهر يتم احتسابه إذا كان هناك أي يوم في الشهر.
    // لحساب دقيق، يمكننا استخدام الفرق بالأيام ثم قسمة 30.44 ولكننا نريد تقريبًا بالأشهر.
    // لتبسيط الحساب، نأخذ الفرق بالأشهر ونضيف 1 إذا كان هناك يوم إضافي (أي إذا كان اليوم > 1)
    // لكن الطريقة الأكثر دقة هي حساب الفرق بالأيام ثم التحويل.
    // هنا سنكتفي بالفرق بالأشهر مع إضافة 1 إذا كان يوم النهاية > يوم البداية (بافتراض أن الشهر بدأ).
    // لكننا سنستخدم طريقة أكثر دقة باستخدام الفرق بالأيام.
    // لنحسب الفرق بالمللي ثانية ثم نقسم على متوسط أيام الشهر.
    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    // نضيف إلى الأشهر المحسوبة سابقًا؟ لا، نفضل استخدام الطريقة المباشرة.
    // لحل التناقض، سنستخدم الدالة monthsBetween التي تحسب الفرق بالأشهر مع مراعاة الأيام.
    // لكننا سنبقي الطريقة البسيطة: الأشهر = (السنة*12+الشهر) - (سنة البداية*12+شهر البداية)
    // مع مراعاة أنه إذا كان اليوم في النهاية >= اليوم في البداية، نضيف شهر؟ لكن هذا غير دقيق.
    // الأفضل هو اعتبار أن كل شهر كامل يتم احتسابه إذا تم تجاوز اليوم المقابل.
    // سنعتمد على الطريقة الشائعة: الفرق بالأشهر = (endYear - startYear)*12 + (endMonth - startMonth) + (endDay >= startDay ? 1 : 0)
    // ولكن هذا يؤدي إلى زيادة غير دقيقة. بدلاً من ذلك، سنقوم بحساب الفرق بالأيام وتحويله لأشهر بقسمة 30.44.
    const diffMonths = diffDays / 30.44;
    totalMonths += diffMonths;
  }

  // 5. تحويل الأشهر إلى سنوات مع منزلة عشرية واحدة
  const years = totalMonths / 12;
  return Math.round(years * 10) / 10;
}
// ----------------------------------------------------------------

export interface CreateCVFormData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  skills: { name: string; category: string; level?: string }[];
  experience: {
    position: string;
    organization: string;
    start_date: string;
    end_date?: string | null;
    description?: string;
    highlights: { text: string }[];
  }[];
  education: {
    degree: string;
    institution: string;
    start_date: string;
    end_date?: string | null;
    gpa?: string;
    description?: string;
  }[];
  certifications?: {
    title: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
    type?: "Certificate" | "Training" | "Course";
    status?: "Completed" | "In Progress" | "Expired";
    level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    description?: string;
    duration?: string;
    skills?: string[];
  }[];
  languages?: {
    language: string;
    level: string;
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  achievements?: {
    title: string;
    description: string;
    date?: string;
  }[];
  references?: {
    name: string;
    position: string;
    organization?: string;
    email?: string;
    phone: string;
    relationship?: string;
  }[];
}

export const validationSchema: yup.ObjectSchema<CreateCVFormData> = yup.object({
  fullName: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  title: yup.string().required("Title is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  phone: yup.string().required("Phone is required"),
  location: yup.string().required("Location is required"),
  summary: yup.string().required("Summary is required"),
  website: yup.string().url("Valid URL required").optional().default(""),
  skills: yup
    .array()
    .of(
      yup
        .object({
          name: yup.string().required("Skill name required"),
          category: yup.string().required("Category required"),
          level: yup.string().optional(),
        })
        .required(),
    )
    .min(1, "At least one skill required")
    .required(),
  experience: yup
    .array()
    .of(
      yup
        .object({
          position: yup.string().required("Position required"),
          organization: yup.string().required("organization required"),
          start_date: yup.string().required("Start date required"),
          end_date: yup.string().nullable().optional(),
          description: yup.string().optional(),
          highlights: yup
            .array()
            .of(
              yup
                .object({
                  text: yup.string().required("Highlight text required"),
                })
                .required(),
            )
            .min(1, "At least one highlight required")
            .required(),
        })
        .required(),
    )
    .min(1, "At least one experience required")
    .required(),
  education: yup
    .array()
    .of(
      yup
        .object({
          degree: yup.string().required("Degree required"),
          institution: yup.string().required("Institution required"),
          start_date: yup.string().required("Start date required"),
          end_date: yup.string().nullable().optional(),
          gpa: yup.string().optional(),
          description: yup.string().optional(),
        })
        .required(),
    )
    .min(1, "At least one education required")
    .required(),
  certifications: yup
    .array()
    .of(
      yup
        .object({
          title: yup.string().required("Title required"),
          issuer: yup.string().required("Issuer required"),
          issue_date: yup.string().required("Issue date required"),
          expiry_date: yup.string().optional(),
          credential_id: yup.string().optional(),
        })
        .required(),
    )
    .default([])
    .optional(),
  languages: yup
    .array()
    .of(
      yup
        .object({
          language: yup.string().required("Language required"),
          level: yup.string().required("Level required"),
        })
        .required(),
    )
    .default([])
    .optional(),
  socialLinks: yup
    .array()
    .of(
      yup
        .object({
          platform: yup.string().required("Platform required"),
          url: yup.string().required("URL required").url("Valid URL required"),
        })
        .required(),
    )
    .default([])
    .optional(),
  projects: yup
    .array()
    .of(
      yup
        .object({
          name: yup.string().required("Project name required"),
          description: yup.string().required("Description required"),
          technologies: yup
            .array()
            .of(yup.string().required())
            .required()
            .min(1, "At least one technology required"),
          link: yup.string().url("Valid URL required").optional(),
        })
        .required(),
    )
    .default([])
    .optional(),
  achievements: yup
    .array()
    .of(
      yup
        .object({
          title: yup.string().required("Achievement title required"),
          description: yup.string().required("Description required"),
          date: yup.string().optional(),
        })
        .required(),
    )
    .default([])
    .optional(),
  references: yup
    .array()
    .of(
      yup
        .object({
          name: yup.string().required("Name required"),
          position: yup.string().required("Position / Relationship required"),
          organization: yup.string().optional().default(""),
          email: yup.string().email("Invalid email").optional().default(""),
          phone: yup.string().required("Phone required"),
          relationship: yup.string().optional().default(""),
        })
        .required(),
    )
    .default([])
    .optional(),
});

// -------------------------------------------------------------------
// Interface for PDF data – added totalExperienceYears
// -------------------------------------------------------------------
interface CVDocumentData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary: string;
  socialLinks: { label: string; url: string }[];
  skills: {
    category: string;
    technologies: { name: string; level?: string }[];
  }[];
  experience: {
    title: string;
    subtitle: string;
    year: string;
    description?: string;
    highlights: string[];
  }[];
  education: {
    title: string;
    institution: string;
    year: string;
    gpa?: string;
    description?: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    year: string;
    credential_id?: string;
    type?: string;
    status?: string;
    level?: string;
    duration?: string;
    description?: string;
    skills?: string[];
  }[];
  languages: { language: string; level: string }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  achievements: {
    title: string;
    description: string;
    date?: string;
  }[];
  references: {
    name: string;
    position: string;
    organization?: string;
    email?: string;
    phone: string;
    relationship?: string;
  }[];
  // 👇 new field
  totalExperienceYears: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 14,
    color: "#2c3e50",
    marginTop: 4,
    marginBottom: 6,
    fontWeight: "500",
  },
  experienceYears: {
    fontSize: 11,
    color: "#2c3e50",
    marginTop: 2,
    fontWeight: "500",
    fontStyle: "italic",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    fontSize: 9.5,
    color: "#2c3e50",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 2,
  },
  contactLabel: {
    fontWeight: "bold",
    marginRight: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    flexWrap: "wrap",
  },
  experienceTitle: {
    fontWeight: "bold",
    color: "#1a1a1a",
    fontSize: 10.5,
  },
  experienceorganization: {
    color: "#2c3e50",
    fontSize: 10,
    fontWeight: "500",
  },
  experienceDate: {
    color: "#7f8c8d",
    fontSize: 9,
  },
  experienceDescription: {
    fontSize: 10,
    color: "#2c3e50",
    marginTop: 3,
    marginBottom: 3,
  },
  bulletPoint: {
    flexDirection: "row",
    marginLeft: 5,
    marginTop: 1,
  },
  bullet: {
    width: 12,
    fontSize: 8,
    color: "#2c3e50",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: "#2c3e50",
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 6,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 1,
  },
  educationDegree: {
    fontWeight: "bold",
    color: "#1a1a1a",
    fontSize: 10.5,
  },
  educationInstitution: {
    color: "#2c3e50",
    fontSize: 10,
    fontWeight: "500",
  },
  educationYear: {
    color: "#7f8c8d",
    fontSize: 9,
  },
  educationGpa: {
    color: "#2c3e50",
    fontSize: 9,
    fontStyle: "italic",
  },
  educationDescription: {
    fontSize: 10,
    color: "#2c3e50",
    marginTop: 2,
    marginLeft: 5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  skillItem: {
    fontSize: 10,
    color: "#2c3e50",
    marginRight: 8,
    marginBottom: 2,
  },
  skillCategory: {
    marginBottom: 4,
  },
  skillCategoryTitle: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  certificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    flexWrap: "wrap",
  },
  certificationTitle: {
    fontWeight: "bold",
    color: "#1a1a1a",
    fontSize: 10,
  },
  certificationIssuer: {
    color: "#2c3e50",
    fontSize: 9.5,
  },
  certificationYear: {
    color: "#7f8c8d",
    fontSize: 9,
  },
  certificationDetails: {
    fontSize: 8.5,
    color: "#4a5568",
    marginTop: 2,
  },
  certificationSkills: {
    fontSize: 8.5,
    color: "#4a5568",
    fontStyle: "italic",
    marginTop: 1,
  },
  techList: {
    fontSize: 9,
    color: "#4a5568",
    marginTop: 2,
  },
  languageItem: {
    fontSize: 10,
    color: "#2c3e50",
    marginBottom: 2,
  },
  languageLevel: {
    color: "#7f8c8d",
    fontSize: 9,
  },
  projectItem: {
    marginBottom: 6,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 1,
  },
  projectName: {
    fontWeight: "bold",
    color: "#1a1a1a",
    fontSize: 10,
  },
  projectTechnologies: {
    color: "#7f8c8d",
    fontSize: 9,
  },
  projectDescription: {
    fontSize: 10,
    color: "#2c3e50",
    marginTop: 1,
  },
  achievementItem: {
    marginBottom: 4,
  },
  achievementTitle: {
    fontWeight: "bold",
    color: "#1a1a1a",
    fontSize: 10,
  },
  achievementDescription: {
    fontSize: 10,
    color: "#2c3e50",
  },
  referenceItem: {
    marginBottom: 4,
    padding: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  referenceName: {
    fontWeight: "bold",
    color: "#1a1a1a",
    fontSize: 10,
  },
  referencePosition: {
    color: "#2c3e50",
    fontSize: 9,
  },
  referenceContact: {
    fontSize: 8.5,
    color: "#7f8c8d",
    marginTop: 1,
  },
  referenceRelationship: {
    fontSize: 8.5,
    color: "#4a5568",
    fontStyle: "italic",
    marginTop: 1,
  },
});

function CVDocument({ data }: { data: CVDocumentData | null }) {
  if (!data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          {/* Display total years of experience */}
          <Text style={styles.experienceYears}>
            {data.totalExperienceYears} years of experience
          </Text>
          <View style={styles.contactRow}>
            {data.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text>{data.phone}</Text>
              </View>
            )}
            {data.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text>{data.email}</Text>
              </View>
            )}
            {data.location && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Location:</Text>
                <Text>{data.location}</Text>
              </View>
            )}
            {data.website && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Website:</Text>
                <Text>{data.website}</Text>
              </View>
            )}
            {data.socialLinks?.map((link, index) => (
              <View key={index} style={styles.contactItem}>
                <Text style={styles.contactLabel}>{link.label}:</Text>
                <Text>{link.url}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 10, color: "#2c3e50", lineHeight: 1.5 }}>
              {data.summary}
            </Text>
          </View>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceTitle}>{exp.title}</Text>
                  <Text style={styles.experienceDate}>{exp.year}</Text>
                </View>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceorganization}>
                    {exp.subtitle}
                  </Text>
                </View>
                {exp.description && (
                  <Text style={styles.experienceDescription}>
                    {exp.description}
                  </Text>
                )}
                {exp.highlights?.map((highlight, hIndex) => (
                  <View key={hIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationDegree}>{edu.title}</Text>
                  <Text style={styles.educationYear}>{edu.year}</Text>
                </View>
                <Text style={styles.educationInstitution}>
                  {edu.institution}
                </Text>
                {edu.gpa && (
                  <Text style={styles.educationGpa}>GPA: {edu.gpa}</Text>
                )}
                {edu.description && (
                  <Text style={styles.educationDescription}>
                    {edu.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map((skillGroup, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>
                  {skillGroup.category}:
                </Text>
                <View style={styles.skillsContainer}>
                  {skillGroup.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={styles.skillItem}>
                      {tech.name}
                      {tech.level && ` (${tech.level})`}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <View style={styles.certificationItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.certificationTitle}>{cert.title}</Text>
                    <Text style={styles.certificationIssuer}>
                      {cert.issuer}
                    </Text>
                  </View>
                  <Text style={styles.certificationYear}>{cert.year}</Text>
                </View>
                {(cert.type || cert.status || cert.level || cert.duration) && (
                  <Text style={styles.certificationDetails}>
                    {[
                      cert.type,
                      cert.status,
                      cert.level ? `Level: ${cert.level}` : null,
                      cert.duration ? `Duration: ${cert.duration}` : null,
                      cert.credential_id
                        ? `Credential ID: ${cert.credential_id}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>
                )}
                {cert.description && (
                  <Text style={styles.certificationDetails}>
                    {cert.description}
                  </Text>
                )}
                {cert.skills && cert.skills.length > 0 && (
                  <Text style={styles.certificationSkills}>
                    Skills: {cert.skills.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  {project.link && (
                    <Text
                      style={[styles.projectTechnologies, { color: "#3498db" }]}
                    >
                      {project.link}
                    </Text>
                  )}
                </View>
                <Text style={styles.projectDescription}>
                  {project.description}
                </Text>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.techList}>
                    Technologies: {project.technologies.join(" • ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {data.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  {achievement.date && (
                    <Text style={styles.certificationYear}>
                      {achievement.date}
                    </Text>
                  )}
                </View>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {data.languages.map((lang, index) => (
              <Text key={index} style={styles.languageItem}>
                {lang.language}{" "}
                <Text style={styles.languageLevel}>({lang.level})</Text>
              </Text>
            ))}
          </View>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {data.references.map((ref, index) => (
                <View
                  key={index}
                  style={[
                    styles.referenceItem,
                    { flex: 1, minWidth: "45%", marginRight: 8 },
                  ]}
                >
                  <Text style={styles.referenceName}>{ref.name}</Text>
                  <Text style={styles.referencePosition}>
                    {ref.position}
                    {ref.organization ? ` - ${ref.organization}` : ""}
                  </Text>
                  {ref.relationship && (
                    <Text style={styles.referenceRelationship}>
                      Relationship: {ref.relationship}
                    </Text>
                  )}
                  {ref.email && (
                    <Text style={styles.referenceContact}>
                      Email: {ref.email}
                    </Text>
                  )}
                  {ref.phone && (
                    <Text style={styles.referenceContact}>
                      Phone: {ref.phone}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

// -------------------------------------------------------------------
// JSON Import / Template helpers
// -------------------------------------------------------------------
const CV_JSON_TEMPLATE: CreateCVFormData = {
  fullName: "Omar Hamad",
  title: "ASP.NET Core / Full Stack Developer",
  email: "example@mail.com",
  phone: "+972500000000",
  location: "Gaza, Palestine",
  summary: "Short professional summary...",
  website: "https://example.com",
  skills: [
    { name: "C#", category: "Programming", level: "Expert" },
    { name: "ASP.NET Core", category: "Backend", level: "Advanced" },
  ],
  experience: [
    {
      position: "Full Stack Developer",
      organization: "Example Company",
      start_date: "May 2024",
      end_date: "Present",
      description: "Short role description (optional)",
      highlights: [
        { text: "Built RESTful APIs with ASP.NET Core" },
        { text: "Improved performance and fixed bugs" },
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor's Degree in Computer Science",
      institution: "Al-Aqsa University",
      start_date: "September 2023",
      end_date: "June 2027",
      gpa: "89.86%",
      description: "Optional description",
    },
  ],
  certifications: [
    {
      title: "Example Certificate",
      issuer: "Example Issuer",
      issue_date: "10 July 2026",
      expiry_date: "",
      credential_id: "",
      type: "Course",
      status: "Completed",
      level: "Beginner",
      description: "Optional description",
      duration: "40 hours",
      skills: ["Skill A", "Skill B"],
    },
  ],
  languages: [{ language: "Arabic", level: "Native or Bilingual" }],
  socialLinks: [{ platform: "LinkedIn", url: "https://linkedin.com/in/..." }],
  projects: [
    {
      name: "Example Project",
      description: "What the project does...",
      technologies: ["ASP.NET Core", "React", "SQL Server"],
      link: "https://example.com",
    },
  ],
  achievements: [
    {
      title: "Example Achievement",
      description: "Achievement details...",
      date: "2024",
    },
  ],
  references: [
    {
      name: "Reference Name",
      position: "Position",
      organization: "Organization",
      email: "ref@mail.com",
      phone: "+972500000000",
      relationship: "Supervisor",
    },
  ],
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : String(v ?? "").trim()))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,،\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

// Accepts highlights as [{text}], ["text"], or comma-separated string
function normalizeHighlights(value: unknown): { text: string }[] {
  if (Array.isArray(value)) {
    return value
      .map((h) => {
        if (typeof h === "string") return { text: h.trim() };
        if (h && typeof h === "object" && "text" in h)
          return { text: asString((h as { text: unknown }).text).trim() };
        return { text: "" };
      })
      .filter((h) => h.text);
  }
  const arr = toStringArray(value);
  return arr.map((text) => ({ text }));
}

function normalizeCvJson(raw: unknown): CreateCVFormData {
  const src = (raw ?? {}) as Record<string, unknown>;

  return {
    fullName: asString(src.fullName),
    title: asString(src.title),
    email: asString(src.email),
    phone: asString(src.phone),
    location: asString(src.location),
    summary: asString(src.summary),
    website: asString(src.website),
    skills: Array.isArray(src.skills)
      ? (src.skills as Record<string, unknown>[]).map((s) => ({
          name: asString(s?.name),
          category: asString(s?.category),
          level: asString(s?.level),
        }))
      : [],
    experience: Array.isArray(src.experience)
      ? (src.experience as Record<string, unknown>[]).map((e) => ({
          position: asString(e?.position),
          organization: asString(e?.organization),
          start_date: asString(e?.start_date),
          end_date: asString(e?.end_date) || null,
          description: asString(e?.description),
          highlights: normalizeHighlights(e?.highlights),
        }))
      : [],
    education: Array.isArray(src.education)
      ? (src.education as Record<string, unknown>[]).map((ed) => ({
          degree: asString(ed?.degree),
          institution: asString(ed?.institution),
          start_date: asString(ed?.start_date),
          end_date: asString(ed?.end_date) || null,
          gpa: asString(ed?.gpa),
          description: asString(ed?.description),
        }))
      : [],
    certifications: Array.isArray(src.certifications)
      ? (src.certifications as Record<string, unknown>[]).map((c) => ({
          title: asString(c?.title),
          issuer: asString(c?.issuer),
          issue_date: asString(c?.issue_date),
          expiry_date: asString(c?.expiry_date),
          credential_id: asString(c?.credential_id),
          type: (asString(c?.type) || undefined) as
            | "Certificate"
            | "Training"
            | "Course"
            | undefined,
          status: (asString(c?.status) || undefined) as
            | "Completed"
            | "In Progress"
            | "Expired"
            | undefined,
          level: (asString(c?.level) || undefined) as
            | "Beginner"
            | "Intermediate"
            | "Advanced"
            | "Expert"
            | undefined,
          description: asString(c?.description),
          duration: asString(c?.duration),
          skills: toStringArray(c?.skills),
        }))
      : [],
    languages: Array.isArray(src.languages)
      ? (src.languages as Record<string, unknown>[]).map((l) => ({
          language: asString(l?.language),
          level: asString(l?.level),
        }))
      : [],
    socialLinks: Array.isArray(src.socialLinks)
      ? (src.socialLinks as Record<string, unknown>[]).map((s) => ({
          platform: asString(s?.platform),
          url: asString(s?.url),
        }))
      : [],
    projects: Array.isArray(src.projects)
      ? (src.projects as Record<string, unknown>[]).map((p) => ({
          name: asString(p?.name),
          description: asString(p?.description),
          technologies: toStringArray(p?.technologies),
          link: asString(p?.link),
        }))
      : [],
    achievements: Array.isArray(src.achievements)
      ? (src.achievements as Record<string, unknown>[]).map((a) => ({
          title: asString(a?.title),
          description: asString(a?.description),
          date: asString(a?.date),
        }))
      : [],
    references: Array.isArray(src.references)
      ? (src.references as Record<string, unknown>[]).map((r) => ({
          name: asString(r?.name),
          position: asString(r?.position),
          organization: asString(r?.organization),
          email: asString(r?.email),
          phone: asString(r?.phone),
          relationship: asString(r?.relationship),
        }))
      : [],
  };
}

export function CreateCVPage() {
  const [previewData, setPreviewData] = useState<CreateCVFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

const {
  register,
  control,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<CreateCVFormData>({
  resolver: yupResolver(validationSchema),
  mode: "onBlur",
  defaultValues: {
    fullName: "Omar Hamad",
    title:
      "ASP.NET Core / Full Stack Developer | C#, SQL Server, Web APIs & Information Systems",
    email: "omar.mohammad.hamad2003@gmail.com",
    phone: "+972597041743",
    location: "Al-Maghazi, Gaza, State of Palestine",
    summary:
      "ASP.NET Core / Full Stack Developer and Computer Science student with hands-on experience developing database-driven web applications, administrative information systems, RESTful Web APIs, reporting functionality, and secure backend services using C#, ASP.NET Core, Entity Framework Core, and Microsoft SQL Server. Experienced in requirements analysis, application maintenance, debugging, quality assurance, authentication and authorization, technical documentation, background processing, and real-time communication. Previously trained within the UNRWA HQG IMT Department, contributing to an Employee Attendance System that supported employee records, attendance workflows, administrative operations, reporting, testing, debugging, and system improvements. Additional experience includes municipal, healthcare, e-commerce, and administrative management systems. Strong foundation in relational database design, API development, software security, maintainable architecture, Git-based workflows, and modern frontend development with React and TypeScript.",

    skills: [
      // Core technologies aligned with the UNRWA ASP.NET Developer (EMIS) role
      { name: "C#", category: "Programming", level: "Expert" },
      { name: "ASP.NET Core", category: "Backend", level: "Expert" },
      {
        name: "ASP.NET Core Web API",
        category: "Backend",
        level: "Expert",
      },
      { name: ".NET 10", category: "Backend", level: "Advanced" },
      {
        name: "Entity Framework Core",
        category: "Backend",
        level: "Advanced",
      },
      { name: "LINQ", category: "Backend", level: "Advanced" },
      { name: "RESTful APIs", category: "Backend", level: "Advanced" },
      {
        name: "Background Services",
        category: "Backend",
        level: "Advanced",
      },
      { name: "SignalR", category: "Backend", level: "Advanced" },

      // Database
      { name: "Microsoft SQL Server", category: "Database", level: "Advanced" },
      { name: "SQL", category: "Database", level: "Advanced" },
      { name: "T-SQL", category: "Database", level: "Advanced" },
      { name: "Database Design", category: "Database", level: "Advanced" },
      {
        name: "Database Normalization",
        category: "Database",
        level: "Advanced",
      },
      {
        name: "Query Optimization",
        category: "Database",
        level: "Intermediate",
      },
      {
        name: "Database Indexing",
        category: "Database",
        level: "Intermediate",
      },
      {
        name: "EF Core Migrations",
        category: "Database",
        level: "Advanced",
      },
      { name: "Transactions", category: "Database", level: "Advanced" },
      { name: "PostgreSQL", category: "Database", level: "Advanced" },

      // Application maintenance, QA, security, and support
      {
        name: "Requirements Analysis",
        category: "Software Engineering",
        level: "Advanced",
      },
      {
        name: "Debugging & Troubleshooting",
        category: "Software Engineering",
        level: "Advanced",
      },
      {
        name: "Quality Assurance & Application Testing",
        category: "Software Engineering",
        level: "Intermediate",
      },
      {
        name: "Application Maintenance",
        category: "Software Engineering",
        level: "Advanced",
      },
      {
        name: "Technical Documentation",
        category: "Software Engineering",
        level: "Advanced",
      },
      {
        name: "Reporting & Administrative Systems",
        category: "Software Engineering",
        level: "Advanced",
      },
      {
        name: "User Training & Technical Support",
        category: "Software Engineering",
        level: "Advanced",
      },
      {
        name: "Problem Solving",
        category: "Software Engineering",
        level: "Advanced",
      },

      // Security
      {
        name: "ASP.NET Core Identity",
        category: "Security",
        level: "Advanced",
      },
      {
        name: "JWT Authentication",
        category: "Security",
        level: "Advanced",
      },
      {
        name: "Role-Based Authorization",
        category: "Security",
        level: "Advanced",
      },
      {
        name: "Policy-Based Authorization",
        category: "Security",
        level: "Advanced",
      },
      {
        name: "Claims-Based Authorization",
        category: "Security",
        level: "Advanced",
      },
      {
        name: "API Security",
        category: "Security",
        level: "Advanced",
      },
      { name: "CORS", category: "Security", level: "Advanced" },

      // Frontend / web pages
      { name: "JavaScript", category: "Frontend", level: "Advanced" },
      { name: "HTML5", category: "Frontend", level: "Advanced" },
      { name: "CSS3", category: "Frontend", level: "Advanced" },
      { name: "Bootstrap", category: "Frontend", level: "Advanced" },
      { name: "React.js", category: "Frontend", level: "Advanced" },
      { name: "TypeScript", category: "Frontend", level: "Advanced" },
      { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },

      // Architecture and development practices
      {
        name: "Clean Architecture",
        category: "Architecture",
        level: "Advanced",
      },
      { name: "CQRS", category: "Architecture", level: "Advanced" },
      { name: "MediatR", category: "Architecture", level: "Advanced" },
      {
        name: "SOLID Principles",
        category: "Architecture",
        level: "Advanced",
      },
      {
        name: "Design Patterns",
        category: "Architecture",
        level: "Advanced",
      },

      // Tools
      { name: "Git", category: "Tools", level: "Advanced" },
      { name: "GitHub", category: "Tools", level: "Advanced" },
      {
        name: "Swagger / OpenAPI",
        category: "Tools",
        level: "Advanced",
      },
      { name: "Postman", category: "Tools", level: "Advanced" },
      { name: "Docker", category: "DevOps", level: "Intermediate" },
      { name: "CI/CD", category: "DevOps", level: "Intermediate" },
    ],

    experience: [
      {
        position: "Team Leader & Volunteer Full Stack Developer",
        organization: "Al-Maghazi Municipality",
        start_date: "July 2026",
        end_date: "Present",
        description:
          "Lead the technical development of a municipal information-management platform, translating operational requirements into secure, maintainable web applications and digital administrative workflows.",
        highlights: [
          {
            text: "Lead development activities, distribute technical tasks, track progress, and coordinate implementation across the team",
          },
          {
            text: "Analyze operational requirements with municipal staff and translate them into application features, workflows, and structured data models",
          },
          {
            text: "Develop and maintain backend services and RESTful Web APIs using ASP.NET Core and C#",
          },
          {
            text: "Develop database-driven administrative functionality for citizens, employees, services, organizational structures, documents, and internal workflows",
          },
          {
            text: "Implement authentication, authorization, role-based permissions, and administrative access controls",
          },
          {
            text: "Build responsive administrative and public-facing interfaces using React and TypeScript",
          },
          {
            text: "Implement reporting-oriented features, filtering, structured data retrieval, and administrative dashboards",
          },
          {
            text: "Handle application maintenance, debugging, issue resolution, performance improvements, deployment, and reliability",
          },
          {
            text: "Contribute to technical documentation, development planning, and communication of implementation decisions",
          },
        ],
      },

      {
        position: "Full Stack Developer",
        organization: "Freelance",
        start_date: "May 2024",
        end_date: "Present",
        description:
          "Design and deliver database-driven web applications and administrative systems using ASP.NET Core, C#, Entity Framework Core, SQL Server, PostgreSQL, React, and TypeScript.",
        highlights: [
          {
            text: "Develop backend services, RESTful Web APIs, and database-driven business logic using C#, ASP.NET Core, Entity Framework Core, SQL Server, and PostgreSQL",
          },
          {
            text: "Analyze business and administrative requirements and translate them into maintainable application features and digital workflows",
          },
          {
            text: "Design relational database schemas and implement querying, filtering, pagination, transactions, and reporting functionality",
          },
          {
            text: "Implement authentication, authorization, role-based access control, notifications, and background processing",
          },
          {
            text: "Build responsive frontend applications using React, TypeScript, Tailwind CSS, and reusable component architectures",
          },
          {
            text: "Integrate frontend applications with backend services through REST APIs and JSON-based data exchange",
          },
          {
            text: "Troubleshoot application and database issues, fix defects, and improve existing functionality, stability, and maintainability",
          },
          {
            text: "Use Swagger/OpenAPI and Postman for API documentation, validation, and testing",
          },
          {
            text: "Apply secure development practices for authentication, authorization, API access, and sensitive application data",
          },
          {
            text: "Use Git and GitHub for source control and Docker for consistent development and deployment environments",
          },
        ],
      },

      {
        position: "Full Stack Web Developer",
        organization: "Developers Plus",
        start_date: "September 2023",
        end_date: "December 2023",
        description:
          "Contributed to the development and maintenance of a database-driven Job Portal and real-time communication platform using ASP.NET Core, SQL Server, JavaScript, Bootstrap, SignalR, and related web technologies.",
        highlights: [
          {
            text: "Developed and maintained web application functionality using ASP.NET Core, C#, JavaScript, and Bootstrap",
          },
          {
            text: "Implemented backend business logic and database-driven features for users, records, requests, and related operations",
          },
          {
            text: "Worked with Microsoft SQL Server for data storage, querying, updating, filtering, and reporting",
          },
          {
            text: "Developed RESTful backend services with authentication and authorization",
          },
          {
            text: "Implemented real-time notifications and communication functionality using SignalR",
          },
          {
            text: "Debugged application issues, fixed defects, and improved existing features, stability, and usability",
          },
          {
            text: "Integrated charts and structured reporting views for administrative data analysis",
          },
        ],
      },

      {
        position: "Full Stack ASP.NET Developer Intern",
        organization: "IMT Department at UNRWA HQG",
        start_date: "July 2023",
        end_date: "August 2023",
        description:
          "Contributed to the development and improvement of an internal Employee Attendance System supporting employee information, attendance workflows, administrative operations, reporting, and application support within the UNRWA HQG IMT environment.",
        highlights: [
          {
            text: "Developed backend and administrative web functionality using ASP.NET Core",
          },
          {
            text: "Worked with employee records, attendance data, administrative workflows, and reporting functionality",
          },
          {
            text: "Implemented backend business logic and database-driven application features using relational data",
          },
          {
            text: "Contributed to automated attendance processing using ASP.NET Core background services",
          },
          {
            text: "Developed responsive administrative interfaces using Bootstrap, JavaScript, and jQuery",
          },
          {
            text: "Contributed to application testing, debugging, issue resolution, and functional improvements",
          },
          {
            text: "Supported real-time communication and notification functionality",
          },
          {
            text: "Gained practical experience working with internal administrative information systems in the UNRWA IT environment",
          },
        ],
      },

      {
        position: "Team Leader & ASP.NET Core Developer",
        organization: "Gaza Training College",
        start_date: "February 2023",
        end_date: "May 2023",
        description:
          "Led a development team while contributing directly to the design and implementation of an ASP.NET Core administrative management system backed by Microsoft SQL Server.",
        highlights: [
          {
            text: "Led the development team and coordinated tasks, milestones, priorities, and technical implementation",
          },
          {
            text: "Analyzed project requirements and translated them into application features and relational database structures",
          },
          {
            text: "Developed backend functionality using ASP.NET Core and C#",
          },
          {
            text: "Designed and managed relational databases using Microsoft SQL Server",
          },
          {
            text: "Implemented CRUD operations, search, filtering, structured data management, and administrative workflows",
          },
          {
            text: "Developed reporting-oriented functionality for administrative data",
          },
          {
            text: "Contributed to debugging, problem solving, technical decisions, and coordination between team members",
          },
        ],
      },

      {
        position: "React Developer",
        organization: "trustangle",
        start_date: "January 2023",
        end_date: "April 2023",
        description:
          "Contributed to the development of responsive web interfaces and reusable frontend components integrated with backend APIs.",
        highlights: [
          {
            text: "Developed responsive and reusable user-interface components using React",
          },
          {
            text: "Integrated frontend applications with backend APIs and structured data",
          },
          {
            text: "Worked with JavaScript, HTML, CSS, and component-based frontend architecture",
          },
          {
            text: "Improved interface responsiveness, usability, structure, and maintainability",
          },
        ],
      },
    ],

    education: [
      {
        degree: "Bachelor's Degree in Computer Science",
        institution: "Al-Aqsa University",
        start_date: "September 2023",
        end_date: "June 2027",
        gpa: "89.86%",
        description:
          "In progress. Computer Science studies focused on software engineering, databases, algorithms, data structures, information systems, web development, and software architecture.",
      },
      {
        degree: "Diploma in Programming and Database Management",
        institution: "Gaza Training College",
        start_date: "September 2021",
        end_date: "June 2023",
        gpa: "93.3%",
        description:
          "Completed diploma focused on software development, programming fundamentals, database design and management, web applications, information systems, and practical application development.",
      },
    ],

    certifications: [
      {
        title: "CodeMap 2026 Training Program",
        issuer: "TAQAT",
        issue_date: "10 July 2026",
        type: "Training",
        status: "Completed",
        level: "Beginner",
        duration: "144 hours",
        description:
          "Completed a 144-hour software development training program covering professional development workflows, software architecture, maintainable code, scalable systems, and software engineering best practices.",
        skills: [
          "Software Architecture",
          "Clean Code",
          "Development Workflow",
          "Scalable Systems",
          "Software Maintainability",
          "Software Engineering Best Practices",
        ],
      },
    ],

    languages: [
      { language: "Arabic", level: "Native or Bilingual" },
      { language: "English", level: "Intermediate" },
    ],

    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/omar-hamad-521911274",
      },
      {
        platform: "GitHub",
        url: "https://github.com/EngOmarHamad",
      },
    ],

    projects: [
      {
        name: "Employee Attendance System – UNRWA HQG",
        description:
          "Internal employee attendance and administrative management system developed during training at the UNRWA HQG IMT Department, supporting employee records, attendance workflows, reporting, administrative operations, testing, and real-time functionality.",
        technologies: [
          "ASP.NET Core",
          "C#",
          "SQL Server",
          "JavaScript",
          "Bootstrap",
          "SignalR",
          "REST APIs",
          "Reporting",
          "Background Services",
        ],
      },

      {
        name: "Tabibi Clinic Management System",
        description:
          "Database-driven clinic management platform for doctors, patients, appointments, schedules, authentication, notifications, and administrative workflows, with secure APIs and role-based access control.",
        link: "https://tabibi-frontend.vercel.app/",
        technologies: [
          "ASP.NET Core",
          ".NET 10",
          "C#",
          "SQL Server",
          "Entity Framework Core",
          "REST APIs",
          "ASP.NET Core Identity",
          "JWT",
          "SignalR",
          "React",
          "TypeScript",
          "CQRS",
        ],
      },

      {
        name: "Socotry E-Commerce & Administration Platform",
        link: "https://youtu.be/CKiXxyAhlZA?si=z-6K2dYQ1ZvwBQb9",
        description:
          "Database-driven e-commerce and administrative platform supporting products, customers, orders, checkout, delivery operations, search, notifications, and administrative reporting.",
        technologies: [
          "ASP.NET Core",
          "C#",
          "Entity Framework Core",
          "SQL Server",
          "REST APIs",
          "ASP.NET Core Identity",
          "JavaScript",
          "Bootstrap",
          "SignalR",
          "DataTables",
          "Chart.js",
          "Reporting",
        ],
      },

      {
        name: "Maghazi Municipality Management System",
        description:
          "Municipal information-management platform designed to digitize administrative operations, citizen services, employees, organizational structures, documents, content, and internal workflows through a centralized system.",
        link: "https://maghazi-municipality.vercel.app/",
        technologies: [
          "ASP.NET Core",
          ".NET 10",
          "C#",
          "React",
          "TypeScript",
          "PostgreSQL",
          "REST APIs",
          "Entity Framework Core",
          "CQRS",
          "MediatR",
          "Clean Architecture",
        ],
      },

      {
        name: "Orphans Management System",
        link: "https://youtu.be/yenx0JyeRu4?si=6SGdVugE-rYKddFj",
        description:
          "Administrative information system for managing records, personal and family information, sponsorships, assistance programs, documents, follow-ups, and reporting through a centralized database-driven platform.",
        technologies: [
          "ASP.NET Core",
          "C#",
          "Entity Framework Core",
          "SQL Server",
          "JavaScript",
          "Bootstrap",
          "REST APIs",
          "Data Management",
          "Reporting",
        ],
      },
    ],

    achievements: [
      {
        title: "Hult Prize – Team Leader & Software Developer",
        description:
          "Led a multidisciplinary team in developing a sustainable entrepreneurship project addressing clothing waste through a circular-economy model. Coordinated planning and task distribution while contributing to the software application supporting the project's operational workflow.",
      },
    ],

    references: [
      {
        name: "Eng. Tahani Al-Naouq",
        position: "Instructor / Engineer",
        organization: "Gaza Training College (GTC)",
        relationship: "Academic Reference",
        email: "",
        phone: "+972 59-948-4049",
      },
      {
        name: "Nael Ali Mousa",
        position: "Computer Technician",
        organization: "Al-Maghazi Municipality",
        relationship: "Technical Supervisor",
        email: "n.mousa@momg.ps",
        phone: "+972 59-963-3588",
      },
      {
        name: "Adeeb Mahmoud Abu Ghzal",
        position: "Head of Public Relations and Media Department",
        organization: "Al-Maghazi Municipality",
        relationship: "Supervisor / Professional Reference",
        email: "a.ghzal@momg.ps",
        phone: "+972 59-960-4530",
      },
      {
        name: "Wissam Al-Balawi",
        position: "Freelance Software Developer",
        organization: "",
        relationship: "Professional Colleague / Freelance Collaborator",
        email: "",
        phone: "+972 59-992-4216",
      },
    ],
  },
  // defaultValues: {
  //   fullName: "Omar Hamad",
  //   title:
  //     "Full Stack Developer | Automation & System Integration Solutions (ASP.NET Core, React, n8n)",
  //   email: "omar.mohammad.hamad2003@gmail.com",
  //   phone: "+972597041743",
  //   location: "Al-Maghazi, Gaza, Palestine",
  //   summary:
  //     "Full Stack Developer and Computer Science student (expected graduation 2027) with 2.5–3 years of hands-on experience building scalable web applications, administrative systems, RESTful APIs, database-driven platforms, and automated workflow solutions using C#, ASP.NET Core, React, TypeScript, and SQL databases. Experienced in Clean Architecture, CQRS, MediatR, Entity Framework Core, system integration, authentication and authorization, background services, real-time communication, reporting, and maintainable software design. Hands-on experience with automation platforms such as n8n, Zapier, and Make to connect systems, trigger notifications, and eliminate manual processes, alongside backend automation patterns (Outbox Pattern, Domain Events, Background Services). Practical experience containerizing and deploying applications with Docker. Built practical systems for municipal administration, clinic management, e-commerce, employee attendance, and administrative case management. Strong ability to analyze business requirements, transform administrative workflows into reliable software solutions, integrate systems through REST APIs and Webhooks, troubleshoot existing applications, provide user training and technical support, and work with structured data. Familiar with AI-assisted software development tools, with a strong commitment to data privacy and information security when integrating AI or automation tools with sensitive organizational data. Comfortable with Git/GitHub, deployment workflows, and modern development practices.",
  //   skills: [
  //     { name: "C#", category: "Programming", level: "Expert" },
  //     { name: "TypeScript", category: "Programming", level: "Advanced" },
  //     { name: "JavaScript", category: "Programming", level: "Advanced" },
  //     { name: "ASP.NET Core", category: "Backend", level: "Expert" },
  //     {
  //       name: "ASP.NET Core Web API",
  //       category: "Backend",
  //       level: "Expert",
  //     },
  //     { name: ".NET 10", category: "Backend", level: "Advanced" },
  //     {
  //       name: "Entity Framework Core",
  //       category: "Backend",
  //       level: "Advanced",
  //     },
  //     { name: "LINQ", category: "Backend", level: "Advanced" },
  //     { name: "MediatR", category: "Backend", level: "Advanced" },
  //     { name: "FluentValidation", category: "Backend", level: "Advanced" },
  //     { name: "SignalR", category: "Backend", level: "Advanced" },
  //     {
  //       name: "Background Services",
  //       category: "Backend",
  //       level: "Advanced",
  //     },
  //     { name: "React.js", category: "Frontend", level: "Advanced" },
  //     { name: "React 19", category: "Frontend", level: "Advanced" },
  //     { name: "HTML5", category: "Frontend", level: "Advanced" },
  //     { name: "CSS3", category: "Frontend", level: "Advanced" },
  //     { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
  //     { name: "TanStack Query", category: "Frontend", level: "Advanced" },
  //     { name: "React Hook Form", category: "Frontend", level: "Advanced" },
  //     { name: "RESTful APIs", category: "Integration", level: "Advanced" },
  //     {
  //       name: "API Integration",
  //       category: "Integration",
  //       level: "Advanced",
  //     },
  //     { name: "JSON", category: "Integration", level: "Advanced" },
  //     {
  //       name: "System Integration",
  //       category: "Integration",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Workflow Automation",
  //       category: "Automation",
  //       level: "Advanced",
  //     },
  //     { name: "n8n", category: "Automation", level: "Intermediate" },
  //     { name: "Zapier", category: "Automation", level: "Intermediate" },
  //     {
  //       name: "Make (Integromat)",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     { name: "Webhooks", category: "Automation", level: "Advanced" },
  //     {
  //       name: "AI-Assisted Development",
  //       category: "Automation",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Data Privacy in AI/Automation Workflows",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     { name: "SQL Server", category: "Database", level: "Advanced" },
  //     { name: "PostgreSQL", category: "Database", level: "Advanced" },
  //     { name: "Database Design", category: "Database", level: "Advanced" },
  //     { name: "SQL", category: "Database", level: "Advanced" },
  //     { name: "Redis", category: "Database", level: "Intermediate" },
  //     {
  //       name: "Clean Architecture",
  //       category: "Architecture",
  //       level: "Advanced",
  //     },
  //     { name: "CQRS", category: "Architecture", level: "Advanced" },
  //     {
  //       name: "SOLID Principles",
  //       category: "Architecture",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Design Patterns",
  //       category: "Architecture",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Domain Events",
  //       category: "Architecture",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Outbox Pattern",
  //       category: "Architecture",
  //       level: "Advanced",
  //     },
  //     { name: "Git", category: "Tools", level: "Advanced" },
  //     { name: "GitHub", category: "Tools", level: "Advanced" },
  //     { name: "Docker", category: "DevOps", level: "Intermediate" },
  //     { name: "CI/CD", category: "DevOps", level: "Intermediate" },
  //     {
  //       name: "Problem Solving",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Technical Documentation",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Requirements Analysis",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Debugging & Troubleshooting",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "User Training & Technical Support",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Self Learning",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     {
  //       name: "Time Management",
  //       category: "Professional",
  //       level: "Advanced",
  //     },
  //     // Automation
  //     {
  //       name: "Workflow & Business Process Automation",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "API & Webhook Automation",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Background Services & Scheduled Jobs",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Event-Driven Workflows",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Automated Task Processing",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Automated Notifications & Email Workflows",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Data Processing & Synchronization",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Outbox Pattern & Reliable Processing",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Retry, Idempotency & Failure Handling",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "Automated Reporting",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //     {
  //       name: "CI/CD Automation",
  //       category: "Automation",
  //       level: "Intermediate",
  //     },
  //   ],
  //   experience: [
  //     {
  //       position: "Team Leader & Volunteer Full Stack Developer",
  //       organization: "Al-Maghazi Municipality",
  //       start_date: "July 2026",
  //       end_date: "Present",
  //       description:
  //         "Lead a development team contributing to the digital transformation of municipal services, coordinating tasks and technical implementation while developing solutions that improve citizen access to services and help municipal staff manage information, requests, documents, and internal workflows more efficiently.",
  //       highlights: [
  //         {
  //           text: "Led the development team, distributed tasks based on team members' responsibilities and skills, tracked progress, and coordinated technical implementation",
  //         },
  //         {
  //           text: "Worked with municipal staff to analyze operational requirements and translate them into practical software solutions",
  //         },
  //         {
  //           text: "Developed full-stack municipal applications using ASP.NET Core, React, TypeScript, and PostgreSQL",
  //         },
  //         {
  //           text: "Implemented citizen requests, service applications, document management, announcements, and administrative workflows",
  //         },
  //         {
  //           text: "Built content management features that allow municipal staff to manage and publish public information",
  //         },
  //         {
  //           text: "Automated internal workflows and notifications between municipal departments to reduce repetitive manual processing",
  //         },
  //         {
  //           text: "Designed REST APIs and integrated frontend applications with backend services and relational databases",
  //         },
  //         {
  //           text: "Implemented authentication, authorization, role-based permissions, and administrative access controls",
  //         },
  //         {
  //           text: "Contributed to technical decision-making, task prioritization, problem solving, and coordination between development activities",
  //         },
  //         {
  //           text: "Handled deployment, maintenance, debugging, performance improvements, and application reliability",
  //         },
  //       ],
  //     },

  //     {
  //       position: "Full Stack Developer",
  //       organization: "Freelance",
  //       start_date: "May 2024",
  //       end_date: "Present",
  //       description:
  //         "Design and deliver web-based solutions for different business and administrative needs, from understanding requirements and organizing data to building applications that simplify daily operations, automate repetitive tasks, and improve access to information.",
  //       highlights: [
  //         {
  //           text: "Developed backend services and RESTful APIs using C#, ASP.NET Core, Entity Framework Core, PostgreSQL, and SQL Server",
  //         },
  //         {
  //           text: "Built responsive frontend applications using React, TypeScript, Tailwind CSS, TanStack Query, and reusable component architectures",
  //         },
  //         {
  //           text: "Analyzed business requirements and translated them into maintainable application features and digital workflows",
  //         },
  //         {
  //           text: "Implemented authentication, authorization, role-based access control, notifications, background processing, and reporting",
  //         },
  //         {
  //           text: "Designed relational database schemas and implemented efficient querying, filtering, pagination, and reporting",
  //         },
  //         {
  //           text: "Integrated frontend and backend applications through REST APIs and JSON-based data exchange",
  //         },
  //         {
  //           text: "Integrated external services and automated workflows using Webhooks, n8n, Zapier, and Make",
  //         },
  //         {
  //           text: "Applied Clean Architecture, CQRS, MediatR, Domain Events, and SOLID principles in larger applications",
  //         },
  //         {
  //           text: "Used Docker to provide consistent development and deployment environments",
  //         },
  //         {
  //           text: "Used AI-assisted development tools for coding, debugging, analysis, and documentation while maintaining data privacy practices",
  //         },
  //       ],
  //     },

  //     {
  //       position: "Full Stack Web Developer",
  //       organization: "Developers Plus",
  //       start_date: "September 2023",
  //       end_date: "December 2023",
  //       description:
  //         "Contributed to the development and improvement of web applications that organize user information, requests, and daily operations, while helping improve communication, data management, application reliability, and usability.",
  //       highlights: [
  //         {
  //           text: "Developed and maintained web application functionality using ASP.NET Core and JavaScript",
  //         },
  //         {
  //           text: "Implemented backend business logic and database-driven features for users, records, requests, and related operations",
  //         },
  //         {
  //           text: "Worked with SQL Server for data storage, querying, updating, filtering, and reporting",
  //         },
  //         {
  //           text: "Integrated application components with backend services and structured data",
  //         },
  //         {
  //           text: "Implemented real-time communication functionality using SignalR",
  //         },
  //         {
  //           text: "Debugged application issues and improved existing features, stability, and usability",
  //         },
  //       ],
  //     },

  //     {
  //       position: "Full Stack ASP.NET Developer Intern",
  //       organization: "IMT Department at UNRWA HQG",
  //       start_date: "July 2023",
  //       end_date: "August 2023",
  //       description:
  //         "Supported the development of internal administrative applications used to organize employee information, attendance records, routine operations, and reporting, while contributing to testing and improving application functionality.",
  //       highlights: [
  //         {
  //           text: "Developed backend and administrative features using ASP.NET Core",
  //         },
  //         {
  //           text: "Worked with employee records, attendance data, administrative workflows, and reporting functionality",
  //         },
  //         {
  //           text: "Implemented backend business logic and database-driven application features",
  //         },
  //         {
  //           text: "Worked with relational databases for storing, querying, and updating application data",
  //         },
  //         {
  //           text: "Contributed to real-time communication and notification functionality",
  //         },
  //         {
  //           text: "Supported application testing, debugging, issue resolution, and functionality improvements",
  //         },
  //       ],
  //     },

  //     {
  //       position: "Team Leader & ASP.NET Core Developer",
  //       organization: "Gaza Training College",
  //       start_date: "February 2023",
  //       end_date: "May 2023",
  //       description:
  //         "Led a development team by organizing tasks, following project progress, analyzing requirements, and coordinating technical implementation while also contributing directly to backend development and database design.",
  //       highlights: [
  //         {
  //           text: "Led a development team and coordinated tasks, milestones, priorities, and technical implementation",
  //         },
  //         {
  //           text: "Analyzed project requirements and translated them into application features and database structures",
  //         },
  //         {
  //           text: "Developed backend functionality using ASP.NET Core and C#",
  //         },
  //         {
  //           text: "Designed and managed relational databases using SQL Server",
  //         },
  //         {
  //           text: "Implemented CRUD operations and structured data management functionality",
  //         },
  //         {
  //           text: "Developed search, filtering, administrative data management, and reporting features",
  //         },
  //         {
  //           text: "Contributed to technical decision-making, problem solving, and coordination between team members",
  //         },
  //       ],
  //     },

  //     {
  //       position: "React Developer",
  //       organization: "trustangle",
  //       start_date: "January 2023",
  //       end_date: "April 2023",
  //       description:
  //         "Contributed to the development of responsive and user-friendly web interfaces, focusing on organizing application screens, improving user interaction, and building reusable interface elements that could be maintained and extended efficiently.",
  //       highlights: [
  //         {
  //           text: "Developed responsive and reusable user interface components using React",
  //         },
  //         {
  //           text: "Integrated frontend applications with backend APIs and structured data",
  //         },
  //         {
  //           text: "Worked with JavaScript, HTML, CSS, and component-based frontend architecture",
  //         },
  //         {
  //           text: "Built reusable UI patterns to improve consistency and maintainability",
  //         },
  //         {
  //           text: "Improved interface responsiveness, usability, and application structure",
  //         },
  //       ],
  //     },
  //   ],
  //   education: [
  //     {
  //       degree: "Bachelor's Degree in Computer Science",
  //       institution: "Al-Aqsa University",
  //       start_date: "September 2023",
  //       end_date: "June 2027",
  //       gpa: "89.86%",
  //       description:
  //         "Computer Science studies focused on software engineering, databases, algorithms, data structures, information systems, web development, and software architecture.",
  //     },
  //     {
  //       degree: "Diploma in Programming and Database Management",
  //       institution: "Gaza Training College",
  //       start_date: "September 2021",
  //       end_date: "June 2023",
  //       gpa: "93.3%",
  //       description:
  //         "Focused on software development, programming fundamentals, database design and management, web applications, information systems, and practical application development.",
  //     },
  //   ],
  //   certifications: [
  //     {
  //       title: "CodeMap 2026 Training Program",
  //       issuer: "TAQAT",
  //       issue_date: "10 July 2026",
  //       type: "Training",
  //       status: "Completed",
  //       level: "Beginner",
  //       duration: "144 hours",
  //       description:
  //         "Completed a 144-hour software development training program covering professional development workflows, software architecture, maintainable code, scalable systems, and software engineering best practices.",
  //       skills: [
  //         "Software Architecture",
  //         "Clean Code",
  //         "Development Workflow",
  //         "Scalable Systems",
  //         "Software Maintainability",
  //         "Professional Best Practices",
  //       ],
  //     },
  //   ],
  //   languages: [
  //     { language: "Arabic", level: "Native or Bilingual" },
  //     { language: "English", level: "Intermediate" },
  //   ],
  //   socialLinks: [
  //     {
  //       platform: "LinkedIn",
  //       url: "https://www.linkedin.com/in/omar-hamad-521911274",
  //     },
  //     {
  //       platform: "GitHub",
  //       url: "https://github.com/EngOmarHamad",
  //     },
  //   ],
  //   projects: [
  //     {
  //       name: "Maghazi Municipality Management System",
  //       description:
  //         "Full-stack municipal management platform designed to digitize administrative operations, manage citizens, employees, services, organizational structures, content, documents, and internal workflows through a centralized system.",
  //       link: "https://maghazi-municipality.vercel.app/",
  //       technologies: [
  //         "ASP.NET Core",
  //         ".NET 10",
  //         "React",
  //         "TypeScript",
  //         "PostgreSQL",
  //         "REST APIs",
  //         "CQRS",
  //         "MediatR",
  //         "Clean Architecture",
  //       ],
  //     },
  //     {
  //       name: "Tabibi Clinic Management System",
  //       description:
  //         "Full-stack clinic management platform for managing doctors, patients, appointments, doctor applications, schedules, notifications, authentication, and administrative workflows.",
  //       link: "https://tabibi-frontend.vercel.app/",
  //       technologies: [
  //         "ASP.NET Core",
  //         "React",
  //         "TypeScript",
  //         "SQL Server",
  //         "Entity Framework Core",
  //         "REST APIs",
  //         "SignalR",
  //         "CQRS",
  //         "Domain Events",
  //         "Outbox Pattern",
  //       ],
  //     },
  //     {
  //       name: "Employee Attendance System",
  //       description:
  //         "Employee attendance and administrative management system developed during training at UNRWA HQG, supporting employee records, attendance workflows, reporting, and real-time functionality.",
  //       technologies: [
  //         "ASP.NET Core",
  //         "SQL Server",
  //         "JavaScript",
  //         "SignalR",
  //         "REST APIs",
  //         "Reporting",
  //       ],
  //     },
  //     {
  //       name: "Socotry E-Commerce Platform",
  //       link: "https://youtu.be/CKiXxyAhlZA?si=z-6K2dYQ1ZvwBQb9",
  //       description:
  //         "Comprehensive full-stack e-commerce platform supporting product and inventory management, customer accounts, order processing, checkout, delivery operations, discounts, promotional sliders, search, notifications, and administrative reporting through dedicated customer and admin interfaces.",
  //       technologies: [
  //         "ASP.NET Core",
  //         "Entity Framework Core",
  //         "SQL Server",
  //         "JavaScript",
  //         "Bootstrap",
  //         "SignalR",
  //         "REST APIs",
  //         "ASP.NET Core Identity",
  //         "DataTables",
  //         "Chart.js",
  //         "Reporting",
  //       ],
  //     },
  //     {
  //       name: "Orphans Management System",
  //       link: "https://youtu.be/yenx0JyeRu4?si=6SGdVugE-rYKddFj",
  //       description:
  //         "Administrative management system designed to organize orphan records, personal and family information, sponsorships, assistance programs, documents, follow-ups, and reporting through a centralized digital platform.",
  //       technologies: [
  //         "ASP.NET Core",
  //         "Entity Framework Core",
  //         "SQL Server",
  //         "JavaScript",
  //         "Bootstrap",
  //         "REST APIs",
  //         "Data Management",
  //         "Reporting",
  //       ],
  //     },
  //   ],
  //   achievements: [
  //     {
  //       title: "Hult Prize – Team Leader & Software Developer",
  //       description:
  //         "Led a multidisciplinary team in developing a sustainable entrepreneurship project addressing clothing waste through a circular economy model. The project focused on purchasing unwanted clothing from individuals at affordable amounts, collecting and recycling the materials, and reselling recycled products in the market. Led team planning and task distribution while designing and developing the software application required to support the project's operational workflow.",
  //     },
  //   ],
  //   references: [
  //     {
  //       name: "Eng. Tahani Al-Naouq",
  //       position: "Instructor / Engineer",
  //       organization: "Gaza Training College (GTC)",
  //       relationship: "Academic Reference",
  //       email: "",
  //       phone: "+972 59-948-4049",
  //     },
  //     {
  //       name: "Nael Ali Mousa",
  //       position: "Computer Technician",
  //       organization: "Al-Maghazi Municipality",
  //       relationship: "Technical Supervisor",
  //       email: "n.mousa@momg.ps",
  //       phone: "+972 59-963-3588",
  //     },
  //     {
  //       name: "Adeeb Mahmoud Abu Ghzal",
  //       position: "Head of Public Relations and Media Department",
  //       organization: "Al-Maghazi Municipality",
  //       relationship: "Supervisor / Professional Reference",
  //       email: "a.ghzal@momg.ps",
  //       phone: "+972 59-960-4530",
  //     },
  //     {
  //       name: "Wissam Al-Balawi",
  //       position: "Freelance Software Developer",
  //       organization: "",
  //       relationship: "Professional Colleague / Freelance Collaborator",
  //       email: "",
  //       phone: "+972 59-992-4216",
  //     },
  //   ],
  // },
});
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: "skills" });
  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: "experience" });
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: "certifications" });
  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({ control, name: "languages" });
  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: "socialLinks" });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control, name: "projects" });
  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });
  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({ control, name: "references" });

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 24);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [previewData]);

  const onSubmit = (data: CreateCVFormData) => {
    setIsGenerating(true);
    setTimeout(() => {
      setPreviewData(data);
      setIsGenerating(false);
    }, 600);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(CV_JSON_TEMPLATE, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJsonError(null);
    setJsonSuccess(null);
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const normalized = normalizeCvJson(raw);
      // Quick validation of required fields before filling the form
      await validationSchema.validate(normalized, { abortEarly: false });
      reset(normalized);
      setPreviewData(null);
      pdfUrlRef.current = null;
      setJsonSuccess(
        `Data imported from ${file.name} successfully — click Generate CV to preview`,
      );
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        setJsonError(`Incomplete JSON: ${err.errors.slice(0, 3).join(", ")}`);
      } else if (err instanceof SyntaxError) {
        setJsonError("Invalid JSON file — please check the file format");
      } else {
        setJsonError("Could not import the file — make sure it is a valid CV template");
      }
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePrint = () => {
    if (pdfUrlRef.current) {
      const printWindow = window.open(
        pdfUrlRef.current,
        "_blank",
        "width=800,height=600",
      );
      if (printWindow) {
        printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <title>Print CV</title>
                            <style>
                                * { margin: 0; padding: 0; }
                                body { 
                                    display: flex; 
                                    justify-content: center; 
                                    align-items: center; 
                                    min-height: 100vh;
                                    background: #f0f0f0;
                                    font-family: Arial, sans-serif;
                                }
                                .print-container {
                                    width: 100%;
                                    max-width: 800px;
                                    background: white;
                                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                    border-radius: 8px;
                                    overflow: hidden;
                                    padding: 20px;
                                }
                                embed {
                                    width: 100%;
                                    height: 90vh;
                                    max-height: 800px;
                                    border: none;
                                }
                                .print-btn {
                                    display: block;
                                    width: 100%;
                                    padding: 12px;
                                    margin-top: 10px;
                                    background: #4f46e5;
                                    color: white;
                                    border: none;
                                    border-radius: 6px;
                                    font-size: 16px;
                                    font-weight: 500;
                                    cursor: pointer;
                                    transition: background 0.3s;
                                }
                                .print-btn:hover { background: #4338ca; }
                                @media print {
                                    .print-btn { display: none !important; }
                                    body { background: white !important; }
                                    .print-container { box-shadow: none !important; padding: 0 !important; border-radius: 0 !important; }
                                    embed { height: 100vh !important; max-height: 100vh !important; }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="print-container">
                                <embed src="${pdfUrlRef.current}" type="application/pdf" />
                                <button class="print-btn" onclick="window.print()">🖨️ Print PDF</button>
                            </div>
                            <script>
                                document.querySelector('embed').addEventListener('load', function() {
                                    setTimeout(function() { window.print() }, 1500)
                                });
                            <\/script>
                        </body>
                    </html>
                `);
        printWindow.document.close();
        printWindow.focus();
      }
    } else {
      window.print();
    }
  };

  // ---------- Prepare data for PDF – now with totalExperienceYears ----------
  const formattedPdfData: CVDocumentData | null = previewData
    ? {
        name: previewData.fullName || "Unknown",
        title: previewData.title || "Professional",
        email: previewData.email || "",
        phone: previewData.phone || "",
        summary: previewData.summary || "",
        location: previewData.location || "",
        website: previewData.website || "",
        socialLinks:
          previewData.socialLinks?.map((s) => ({
            label: s.platform || "",
            url: s.url || "",
          })) || [],
        skills:
          previewData.skills?.reduce((acc: any[], curr) => {
            if (!curr?.category) return acc;
            const existing = acc.find(
              (item) => item.category === curr.category,
            );
            if (existing) {
              existing.technologies.push({
                name: curr.name || "",
                level: curr.level || "",
              });
            } else {
              acc.push({
                category: curr.category,
                technologies: [
                  { name: curr.name || "", level: curr.level || "" },
                ],
              });
            }
            return acc;
          }, []) || [],
        experience:
          previewData.experience?.map((e) => ({
            title: e.position || "",
            subtitle: e.organization || "",
            year: `${e.start_date || ""} - ${e.end_date || "Present"}`,
            description: e.description || "",
            highlights: e.highlights?.map((h) => h.text || "") || [],
          })) || [],
        education:
          previewData.education?.map((ed) => ({
            title: ed.degree || "",
            institution: ed.institution || "",
            year: `${ed.start_date || ""} - ${ed.end_date || "Present"}`,
            gpa: ed.gpa || "",
            description: ed.description || "",
          })) || [],
        certifications:
          previewData.certifications?.map((c) => ({
            title: c.title || "",
            issuer: c.issuer || "",
            year: c.issue_date || "",
            credential_id: c.credential_id || "",
            type: c.type || "",
            status: c.status || "",
            level: c.level || "",
            duration: c.duration || "",
            description: c.description || "",
            skills: c.skills || [],
          })) || [],
        languages:
          previewData.languages?.map((l) => ({
            language: l.language || "",
            level: l.level || "",
          })) || [],
        projects:
          previewData.projects?.map((p) => ({
            name: p.name || "",
            description: p.description || "",
            technologies: p.technologies || [],
            link: p.link || "",
          })) || [],
        achievements:
          previewData.achievements?.map((a) => ({
            title: a.title || "",
            description: a.description || "",
            date: a.date || "",
          })) || [],
        references:
          previewData.references?.map((r) => ({
            name: r.name || "",
            position: r.position || "",
            organization: r.organization || "",
            email: r.email || "",
            phone: r.phone || "",
            relationship: r.relationship || "",
          })) || [],
        // 👇 calculate total experience years
        totalExperienceYears: calculateTotalExperience(previewData.experience),
      }
    : null;

  const fileName = previewData
    ? `${previewData.fullName?.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`
    : "Resume.pdf";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Professional CV Builder
            </h1>
          </div>
          <p className="text-slate-600 mt-2 text-sm">
            Create and download your professional CV
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-h-[85vh] overflow-y-auto"
          >
            {/* JSON Import / Template */}
            <div className="flex flex-col sm:flex-row gap-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Upload className="h-4 w-4" />
                Import JSON Data
              </button>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-indigo-700 border border-indigo-200 py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
              >
                <FileDown className="h-4 w-4" />
                Download JSON Template
              </button>
            </div>
            {jsonError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {jsonError}
              </p>
            )}
            {jsonSuccess && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {jsonSuccess}
              </p>
            )}
            {/* Personal Info */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    {...register("fullName")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Job Title
                  </label>
                  <input
                    {...register("title")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Phone
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Location
                  </label>
                  <input
                    {...register("location")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    {...register("website")}
                    type="url"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {errors.website && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Professional Summary
                </label>
                <textarea
                  {...register("summary")}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                />
                {errors.summary && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.summary.message}
                  </p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Professional Experience
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendExp({
                      position: "",
                      organization: "",
                      start_date: "",
                      end_date: "",
                      description: "",
                      highlights: [{ text: "" }],
                    })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {expFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      {...register(`experience.${index}.position`)}
                      placeholder="Position"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`experience.${index}.organization`)}
                      placeholder="organization"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`experience.${index}.start_date`)}
                      placeholder="Start Date"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`experience.${index}.end_date`)}
                      placeholder="End Date"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <input
                    {...register(`experience.${index}.description`)}
                    placeholder="Description (optional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  <input
                    {...register(`experience.${index}.highlights.0.text`)}
                    placeholder="Key achievement"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  {expFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExp(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Education
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendEdu({
                      degree: "",
                      institution: "",
                      start_date: "",
                      end_date: "",
                      gpa: "",
                      description: "",
                    })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {eduFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      {...register(`education.${index}.degree`)}
                      placeholder="Degree"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`education.${index}.institution`)}
                      placeholder="Institution"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`education.${index}.start_date`)}
                      placeholder="Start Date"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`education.${index}.end_date`)}
                      placeholder="End Date"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`education.${index}.gpa`)}
                      placeholder="GPA (optional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`education.${index}.description`)}
                      placeholder="Description (optional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  {eduFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEdu(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Skills
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendSkill({ name: "", category: "", level: "" })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2 items-center">
                  <input
                    {...register(`skills.${index}.name`)}
                    placeholder="Skill Name"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    {...register(`skills.${index}.category`)}
                    placeholder="Category"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    {...register(`skills.${index}.level`)}
                    placeholder="Level"
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  {skillFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Projects
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendProject({
                      name: "",
                      description: "",
                      technologies: [""],
                      link: "",
                    })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {projectFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2"
                >
                  <input
                    {...register(`projects.${index}.name`)}
                    placeholder="Project Name"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  <textarea
                    {...register(`projects.${index}.description`)}
                    placeholder="Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white resize-none"
                    rows={2}
                  />
                  <input
                    {...register(`projects.${index}.technologies.0`)}
                    placeholder="Technologies (comma separated)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  <input
                    {...register(`projects.${index}.link`)}
                    placeholder="Project Link (optional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  {projectFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Certifications
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendCert({
                      title: "",
                      issuer: "",
                      issue_date: "",
                      expiry_date: "",
                      credential_id: "",
                    })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {certFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      {...register(`certifications.${index}.title`)}
                      placeholder="Title"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`certifications.${index}.issuer`)}
                      placeholder="Issuer"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`certifications.${index}.issue_date`)}
                      placeholder="Issue Date"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`certifications.${index}.expiry_date`)}
                      placeholder="Expiry Date (optional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`certifications.${index}.credential_id`)}
                      placeholder="Credential ID (optional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <select
                      {...register(`certifications.${index}.type`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="">Type</option>
                      <option>Certificate</option>
                      <option>Training</option>
                      <option>Course</option>
                    </select>
                    <select
                      {...register(`certifications.${index}.status`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="">Status</option>
                      <option>Completed</option>
                      <option>In Progress</option>
                      <option>Expired</option>
                    </select>
                    <select
                      {...register(`certifications.${index}.level`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="">Level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                    <input
                      {...register(`certifications.${index}.duration`)}
                      placeholder="Duration (optional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <textarea
                    {...register(`certifications.${index}.description`)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white resize-none"
                  />
                  <input
                    {...register(`certifications.${index}.skills`)}
                    placeholder="Skills (comma separated, optional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  {certFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCert(index)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Languages */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Languages
                </h2>
                <button
                  type="button"
                  onClick={() => appendLang({ language: "", level: "" })}
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {langFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2 items-center">
                  <input
                    {...register(`languages.${index}.language`)}
                    placeholder="Language"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    {...register(`languages.${index}.level`)}
                    placeholder="Level"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  {langFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLang(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Social Links
                </h2>
                <button
                  type="button"
                  onClick={() => appendSocial({ platform: "", url: "" })}
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {socialFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2 items-center">
                  <input
                    {...register(`socialLinks.${index}.platform`)}
                    placeholder="Platform"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    {...register(`socialLinks.${index}.url`)}
                    placeholder="URL"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                  {socialFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocial(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  Achievements
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendAchievement({ title: "", description: "", date: "" })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {achievementFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2"
                >
                  <input
                    {...register(`achievements.${index}.title`)}
                    placeholder="Achievement Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  <textarea
                    {...register(`achievements.${index}.description`)}
                    placeholder="Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white resize-none"
                    rows={2}
                  />
                  <input
                    {...register(`achievements.${index}.date`)}
                    placeholder="Date (optional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                  {achievementFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* References */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  References
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    appendReference({
                      name: "",
                      position: "",
                      organization: "",
                      email: "",
                      phone: "",
                      relationship: "",
                    })
                  }
                  className="text-xs inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {referenceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      {...register(`references.${index}.name`)}
                      placeholder="Name"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`references.${index}.position`)}
                      placeholder="Position"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`references.${index}.organization`)}
                      placeholder="organization"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`references.${index}.email`)}
                      placeholder="Email"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`references.${index}.phone`)}
                      placeholder="Phone"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                    <input
                      {...register(`references.${index}.relationship`)}
                      placeholder="Relationship"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  {referenceFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              Generate CV
            </button>
          </form>

          {/* Preview */}
          <div className="lg:col-span-5">
            <div
              className="sticky top-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center h-[85vh]"
              ref={containerRef}
            >
              {!previewData ? (
                <div className="my-auto text-center text-slate-500 px-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Eye className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700">Live Preview</p>
                  <p className="text-xs mt-1 text-slate-500">
                    Fill the form and click "Generate CV"
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto flex flex-col items-center w-full">
                    <BlobProvider
                      document={<CVDocument data={formattedPdfData} />}
                    >
                      {({ url, loading }) => {
                        if (url) pdfUrlRef.current = url;
                        if (loading) {
                          return (
                            <div className="my-auto flex flex-col items-center gap-2 text-slate-600 text-sm">
                              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                              <span>Rendering PDF...</span>
                            </div>
                          );
                        }
                        if (!url) {
                          return (
                            <div className="my-auto flex flex-col items-center gap-2 text-slate-600 text-sm">
                              <span>No PDF URL available</span>
                            </div>
                          );
                        }
                        return (
                          <div className="w-full flex flex-col items-center">
                            <embed
                              src={url}
                              type="application/pdf"
                              width={
                                containerWidth > 0
                                  ? Math.min(containerWidth, 420)
                                  : 350
                              }
                              height={550}
                              className="rounded-lg shadow-lg border border-slate-200"
                            />
                          </div>
                        );
                      }}
                    </BlobProvider>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 w-full flex gap-3">
                    <PDFDownloadLink
                      document={<CVDocument data={formattedPdfData} />}
                      fileName={fileName}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      {({ loading }) => (
                        <>
                          <Download className="h-4 w-4" />
                          {loading ? "Preparing..." : "Download PDF"}
                        </>
                      )}
                    </PDFDownloadLink>
                    <button
                      onClick={handlePrint}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
