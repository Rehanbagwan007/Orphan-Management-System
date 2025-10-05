"use client"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

const FilePreview = ({ files, onDelete, editable = true }) => {
  const { token, API_BASE_URL } = useAuth()
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (file) => {
    if (!editable) return

    setDeleting(file.publicId)

    try {
      const response = await fetch(`${API_BASE_URL}/upload/${file.publicId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onDelete?.(file)
      } else {
        console.error("Failed to delete file")
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (format) => {
    const imageFormats = ["jpg", "jpeg", "png", "gif", "webp"]
    const docFormats = ["pdf", "doc", "docx"]

    if (imageFormats.includes(format?.toLowerCase())) {
      return "🖼️"
    } else if (docFormats.includes(format?.toLowerCase())) {
      return "📄"
    }
    return "📁"
  }

  const isImage = (format) => {
    const imageFormats = ["jpg", "jpeg", "png", "gif", "webp"]
    return imageFormats.includes(format?.toLowerCase())
  }

  if (!files || files.length === 0) {
    return null
  }

  return (
    <div className="file-preview">
      <h4>Uploaded Files</h4>
      <div className="file-list">
        {files.map((file, index) => (
          <div key={file.publicId || index} className="file-item">
            <div className="file-info">
              <div className="file-icon">
                {isImage(file.format) ? (
                  <img src={file.url || "/placeholder.svg"} alt={file.originalName} className="file-thumbnail" />
                ) : (
                  <span className="file-type-icon">{getFileIcon(file.format)}</span>
                )}
              </div>
              <div className="file-details">
                <div className="file-name" title={file.originalName}>
                  {file.originalName}
                </div>
                <div className="file-meta">
                  {file.size && <span>{formatFileSize(file.size)}</span>}
                  {file.format && <span className="file-format">{file.format.toUpperCase()}</span>}
                </div>
              </div>
            </div>

            <div className="file-actions">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                View
              </a>
              {editable && (
                <button
                  onClick={() => handleDelete(file)}
                  disabled={deleting === file.publicId}
                  className="btn btn-sm btn-danger"
                >
                  {deleting === file.publicId ? "..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilePreview
