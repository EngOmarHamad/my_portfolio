import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155',
        backgroundColor: '#FFFFFF'
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E1',
        paddingBottom: 15,
        marginBottom: 15
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0F172A',
        textTransform: 'uppercase'
    },
    title: {
        fontSize: 13,
        color: '#2563EB',
        marginTop: 4,
        fontWeight: 'semibold'
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
        fontSize: 9,
        color: '#64748B'
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0F172A',
        borderBottomWidth: 1.5,
        borderBottomColor: '#0F172A',
        paddingBottom: 3,
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    section: {
        marginBottom: 12
    },
    text: {
        fontSize: 9,
        lineHeight: 1.4,
        color: '#334155'
    }
})

export function CVDocument({ data }: { data: any }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.name || 'Full Name'}</Text>
                    <Text style={styles.title}>{data.title || 'Software Developer'}</Text>
                    <View style={styles.contactRow}>
                        {data.phone && <Text>Phone: {data.phone}</Text>}
                        {data.email && <Text>Email: {data.email}</Text>}
                        {data.address && <Text>Address: {data.address}</Text>}
                        {data.github && <Text>GitHub: {data.github}</Text>}
                    </View>
                </View>

                {/* Summary */}
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.text}>{data.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {data.experience && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        <Text style={styles.text}>{data.experience}</Text>
                    </View>
                )}

                {/* Education */}
                {data.education && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        <Text style={styles.text}>{data.education}</Text>
                    </View>
                )}

                {/* Skills */}
                {data.skills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.text}>{data.skills}</Text>
                    </View>
                )}

                {/* Certifications */}
                {data.certifications && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        <Text style={styles.text}>{data.certifications}</Text>
                    </View>
                )}

            </Page>
        </Document>
    )
}