

import { useState, useRef } from "react"
import { useAuth } from "../hooks/useAuth"

const FileUpload = ({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  accept = "image/*,.pdf,.doc,.docx",
  maxFiles = 5,
  className = "",
}) => {
  const { token, API_BASE_URL } = useAuth()

  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  //console.log(tokenOP)
   

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const formData = new FormData()

      if (multiple) {
        // Multiple files upload
        Array.from(files)
          .slice(0, maxFiles)
          .forEach((file) => {
            formData.append("files", file)
          })

        const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const data = await response.json()

        if (response.ok) {
          onUploadSuccess?.(data.files)
        } else {
          onUploadError?.(data.message || "Upload failed")
        }
      } else {
        // Single file upload
        formData.append("file", files[0])

       

        const response = await fetch(`${API_BASE_URL}/upload/single`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const data = await response.json()
        console.log(data , "from upload")

        if (response.ok) {
          onUploadSuccess?.(data.file)
        } else {
          onUploadError?.(data.message || "Upload failed")
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      onUploadError?.(error.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`file-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <div
        className={`upload-area ${dragActive ? "drag-active" : ""} ${uploading ? "uploading" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        {uploading ? (
          <div className="upload-loading">
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              {multiple
                ? `Drop files here or click to select (max ${maxFiles} files)`
                : "Drop file here or click to select"}
            </p>
            <p className="upload-hint">Supported formats: Images, PDF, DOC, DOCX (max 5MB each)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload
