"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react"

// Import required CSS
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`

export default function ReadBookPage() {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/books/${params.id}/pdf`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!data.pdfUrl) {
          throw new Error("No PDF URL received")
        }
        setPdfUrl(data.pdfUrl)
      } catch (error) {
        console.error("Error fetching PDF URL:", error)
        setError(error instanceof Error ? error.message : "Failed to load PDF")
        // Don't redirect immediately, show error state instead
      } finally {
        setIsLoading(false)
      }
    }

    fetchPdfUrl()
  }, [params.id])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error)
    setError("Failed to load PDF document")
    setIsLoading(false)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || prev))
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.0))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Book Details
        </Button>
        {error && (
          <Button variant="destructive" onClick={() => router.push(`/dashboard/user/books/${params.id}`)}>
            Return to Book Page
          </Button>
        )}
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          {error ? (
            <div className="text-center py-8 text-red-500">
              <p className="text-lg font-semibold">Error: {error}</p>
              <p className="mt-2">Please try again later or contact support if the problem persists.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                  <Button onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 0) || isLoading}>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={zoomOut} disabled={isLoading}>
                    <ZoomOut className="mr-2 h-4 w-4" /> Zoom Out
                  </Button>
                  <Button onClick={zoomIn} disabled={isLoading}>
                    <ZoomIn className="mr-2 h-4 w-4" /> Zoom In
                  </Button>
                </div>
              </div>

              <div className="text-center mb-4">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading PDF...</span>
                  </div>
                ) : (
                  numPages && (
                    <span>
                      Page {pageNumber} of {numPages}
                    </span>
                  )
                )}
              </div>

              {pdfUrl && (
                <div className="flex justify-center border rounded-lg overflow-auto max-h-[750px]">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex items-center justify-center h-[750px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      loading={
                        <div className="flex items-center justify-center h-[750px]">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      }
                    />
                  </Document>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}