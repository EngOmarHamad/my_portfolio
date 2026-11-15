import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer'
import { Document, Page, pdfjs } from 'react-pdf'
import { Download, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CVDocument } from './CVDocument'
import { generateCVData } from '@/portfolio/services/cv'

// ضبط محرك pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export function CVPage() {
  const [numPages, setNumPages] = useState<number>(1)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['cv-data'],
    queryFn: generateCVData,
  })

  // حساب عرض الحاوية تلقائياً عند تغيير حجم الشاشة لمنع التمدد المشوه
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // نأخذ عرض الحاوية ونطرح منها البادينج (Padding)
        const width = containerRef.current.clientWidth - 24
        setContainerWidth(width)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 text-slate-800 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return <div role="alert" className="min-h-screen bg-slate-100 px-4 py-16 text-center text-sm text-slate-700">The CV could not be loaded right now. Please try again later.</div>
  }

  const fileName = `${(data.name || 'CV').replace(/\s+/g, '_')}_Resume.pdf`

  // العرض الأقصى لصفحة A4 قياسية بالبيكسل
  const pdfWidth = containerWidth > 0 ? Math.min(containerWidth, 794) : 320

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-8 px-3 sm:px-6 relative pb-20 sm:pb-8">
      {/* 1. الشريط العلوي */}
      <div className="mx-auto max-w-[210mm] mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>

        {/* زر التنزيل للشاشات الكبيرة */}
        <PDFDownloadLink
          document={<CVDocument data={data} />}
          fileName={fileName}
          className="hidden sm:inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
        >
          {({ loading }) =>
            loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Preparing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF
              </>
            )
          }
        </PDFDownloadLink>
      </div>

      {/* 2. منطقة المعاينة المضبوطة أبعادها بدقة */}
      <div className="mx-auto max-w-[210mm]" ref={containerRef}>
        <div className="bg-slate-200/70 rounded-xl shadow-inner overflow-y-auto border border-slate-300 h-[75vh] sm:h-[85vh] p-3 flex flex-col items-center">
          <BlobProvider document={<CVDocument data={data} />}>
            {({ url, loading }) => {
              if (loading || !url) {
                return (
                  <div className="my-auto flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
                    <span>Preparing document view...</span>
                  </div>
                )
              }

              return (
                <Document
                  file={url}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex flex-col items-center gap-4"
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-md rounded border border-slate-200 overflow-hidden"
                    >
                      <Page
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={pdfWidth}
                      />
                    </div>
                  ))}
                </Document>
              )
            }}
          </BlobProvider>
        </div>
      </div>

      {/* 3. زر التنزيل العائم المخصص للموبايل */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
        <PDFDownloadLink
          document={<CVDocument data={data} />}
          fileName={fileName}
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-medium text-sm shadow-sm active:scale-[0.98] border border-slate-700"
        >
          {({ loading }) =>
            loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF Resume
              </>
            )
          }
        </PDFDownloadLink>
      </div>
    </div>
  )
}
