import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import type { CVData } from '@/shared/types/cv-data'

// ملاحظة: لا داعي لتسجيل خط Helvetica خارجي، فهو مدمج قياسياً في PDF 
// مما يضمن قراءة النصوص بترميز UTF-8 نظيف ومفهوم لأنظمة ATS.

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 35,
        paddingHorizontal: 35,
        fontSize: 9,
        fontFamily: 'Helvetica',
        color: '#0f172a',
    },
    header: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#0f172a',
        paddingBottom: 8,
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#334155',
        marginTop: 2,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 6,
        fontSize: 8.5,
        color: '#475569',
    },
    socialRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 4,
        fontSize: 8.5,
        color: '#475569',
    },
    link: {
        color: '#1e293b',
        textDecoration: 'none',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#0f172a',
        paddingBottom: 2,
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    boldText: {
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
    },
    subText: {
        color: '#475569',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginTop: 2,
        paddingLeft: 4,
    },
    bullet: {
        width: 10,
        fontSize: 8.5,
    },
    bulletContent: {
        flex: 1,
        fontSize: 8.5,
        color: '#1e293b',
    },
    skillRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    skillCategory: {
        fontFamily: 'Helvetica-Bold',
        width: 120,
        fontSize: 8.5,
    },
    skillList: {
        flex: 1,
        fontSize: 8.5,
    },
    skillItem: {
        fontSize: 8.5,
        marginBottom: 3,
        lineHeight: 1.3,
    },
})

export function CVDocument({ data }: { data: CVData | null }) {
    if (!data) return null

    return (
        <Document title={`${data.name || 'CV'} - Resume`}>
            <Page size="A4" style={styles.page}>

                {/* HEADER & CONTACT */}
                <View style={styles.header} wrap={false}>
                    {data.name && <Text style={styles.name}>{data.name}</Text>}
                    {data.title && <Text style={styles.title}>{data.title}</Text>}

                    <View style={styles.contactRow}>
                        {data.location && <Text>{data.location}</Text>}
                        {data.phone && (
                            <Text>
                                {data.location ? ' • ' : ''}
                                {data.phone}
                            </Text>
                        )}
                        {data.email && (
                            <Text>
                                {(data.location || data.phone) ? ' • ' : ''}
                                <Link src={`mailto:${data.email}`} style={styles.link}>{data.email}</Link>
                            </Text>
                        )}
                        {data.website && (
                            <Text>
                                • <Link src={data.website} style={styles.link}>{data.website}</Link>
                            </Text>
                        )}
                    </View>

                    {data.socialLinks && data.socialLinks.length > 0 && (
                        <View style={styles.socialRow}>
                            {data.socialLinks.map((link, idx) => (
                                <Text key={idx}>
                                    {idx > 0 ? ' • ' : ''}
                                    <Text style={styles.boldText}>{link.label}: </Text>
                                    <Link src={link.url} style={styles.link}>{link.url}</Link>
                                </Text>
                            ))}
                        </View>
                    )}
                </View>

                {/* SUMMARY */}
                {data.summary && (
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={{ fontSize: 8.5, color: '#1e293b' }}>{data.summary}</Text>
                    </View>
                )}

                {/* TECHNICAL SKILLS */}
                {data.skills && data.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        {data.skills.map((skill, idx) => (
                            <Text key={idx} style={styles.skillItem}>
                                <Text style={styles.boldText}>{skill.category}: </Text>
                                <Text style={styles.subText}>
                                    {skill.technologies.join(', ')}{skill.level ? ` (${skill.level})` : ''}
                                </Text>
                            </Text>
                        ))}
                    </View>
                )}

                {/* EXPERIENCE */}
                {data.experience && data.experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {data.experience.map((exp, idx) => (
                            <View key={idx} wrap={false} style={{ marginBottom: 8 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={{ flex: 1, paddingRight: 8 }}>
                                        <Text style={styles.boldText}>{exp.title}</Text>
                                        {exp.subtitle && <Text style={styles.subText}> — {exp.subtitle}</Text>}
                                    </Text>
                                    {exp.year && <Text style={styles.boldText}>{exp.year}</Text>}
                                </View>

                                {exp.description && (
                                    <Text style={{ fontSize: 8.5, marginTop: 1, color: '#334155' }}>{exp.description}</Text>
                                )}

                                {exp.highlights?.map((h: string, i: number) => (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>• </Text>
                                        <Text style={styles.bulletContent}>{h}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* PROJECTS */}
                {data.projects && data.projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {data.projects.map((proj, idx) => (
                            <View key={idx} wrap={false} style={{ marginBottom: 6 }}>
                                <Text style={styles.boldText}>{proj.title}</Text>
                                {proj.summary && (
                                    <Text style={{ fontSize: 8.5, marginTop: 1, color: '#1e293b' }}>{proj.summary}</Text>
                                )}
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <Text style={{ fontSize: 8, color: '#475569', marginTop: 2 }}>
                                        <Text style={styles.boldText}>Technologies: </Text>
                                        {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                                    </Text>
                                )}
                                {proj.link && <Link src={proj.link} style={styles.link}>{proj.link}</Link>}
                            </View>
                        ))}
                    </View>
                )}

                {/* EDUCATION */}
                {data.education && data.education.length > 0 && (
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu, idx) => (
                            <View key={idx} style={{ marginBottom: 5 }}>
                            <View style={[styles.itemHeader, { marginBottom: 3 }]}>
                                <Text style={{ flex: 1 }}>
                                    <Text style={styles.boldText}>{edu.title}</Text>
                                    {edu.institution && <Text style={styles.subText}> — {edu.institution}</Text>}
                                </Text>
                                {edu.year && <Text style={styles.boldText}>{edu.year}</Text>}
                            </View>
                            {edu.gpa && <Text style={styles.subText}>GPA: {edu.gpa}</Text>}
                            {edu.description && <Text style={styles.subText}>{edu.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* CERTIFICATIONS */}
                {data.certifications && data.certifications.length > 0 && (
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {data.certifications.map((cert, idx) => (
                            <View key={idx} style={{ marginBottom: 5 }}>
                            <View style={[styles.itemHeader, { marginBottom: 3 }]}>
                                <Text style={{ flex: 1 }}>
                                    <Text style={styles.boldText}>{cert.title}</Text>
                                    {cert.issuer && <Text style={styles.subText}> — {cert.issuer}</Text>}
                                </Text>
                                {cert.year && <Text style={styles.boldText}>{cert.year}</Text>}
                            </View>
                            {[cert.type, cert.status, cert.level, cert.duration].filter(Boolean).length > 0 && <Text style={styles.subText}>{[cert.type, cert.status, cert.level, cert.duration].filter(Boolean).join(' · ')}</Text>}
                            {cert.description && <Text style={styles.subText}>{cert.description}</Text>}
                            {cert.skills && cert.skills.length > 0 && <Text style={styles.subText}>Skills: {cert.skills.join(', ')}</Text>}
                            {cert.credentialUrl && <Link src={cert.credentialUrl} style={styles.link}>View credential</Link>}
                            </View>
                        ))}
                    </View>
                )}

                {/* LANGUAGES */}
                {data.languages && data.languages.length > 0 && (
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Languages</Text>
                        <Text style={{ fontSize: 8.5 }}>
                            {data.languages.map((l) => `${l.language} (${l.level})`).join('  •  ')}
                        </Text>
                    </View>
                )}

                {data.achievements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Achievements</Text>
                        {data.achievements.map((item, index) => (
                            <View key={index} style={{ marginBottom: 5 }} wrap={false}>
                                <Text style={styles.boldText}>{item.title}{item.date ? ` · ${item.date}` : ''}</Text>
                                {item.description && <Text style={styles.subText}>{item.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {data.references.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>References</Text>
                        {data.references.map((item, index) => (
                            <View key={index} style={{ marginBottom: 4 }} wrap={false}>
                                <Text style={styles.boldText}>{item.name} — {item.position}</Text>
                                <Text style={styles.subText}>{[item.organization, item.relationship, item.email, item.phone].filter(Boolean).join(' · ')}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </Page>
        </Document>
    )
}
