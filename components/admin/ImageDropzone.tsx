'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { CircleAlert, ImagePlus, LoaderCircle, Upload, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  validateImageFile,
} from '@/lib/upload-rules'

type ImageDropzoneProps = {
  label: string
  hint?: string
  /** Lets the form scroll this field into view when validation fails. */
  id?: string
  /** Renders the red asterisk, matching the `Field` treatment. */
  required?: boolean
  /** Gallery mode: appends instead of replacing, and renders a grid. */
  multiple?: boolean
  /** Remote URLs already stored for this field. */
  value: string[]
  onChange: (urls: string[]) => void
  error?: string
  className?: string
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json().catch(() => ({}))

  if (!res.ok || typeof data.url !== 'string') {
    throw new Error(data.error || 'No se pudo subir la imagen.')
  }

  return data.url
}

export function ImageDropzone({
  label,
  hint,
  id,
  required,
  multiple = false,
  value,
  onChange,
  error,
  className,
}: ImageDropzoneProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Object URL of the file being uploaded, shown straight away so the user
  // doesn't wait on the network to see what they picked.
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const pendingRef = useRef<string | null>(null)

  const setPreview = useCallback((url: string | null) => {
    if (pendingRef.current) {
      URL.revokeObjectURL(pendingRef.current)
    }
    pendingRef.current = url
    setPendingPreview(url)
  }, [])

  // Free the object URL on unmount so navigating away mid-upload doesn't leak.
  useEffect(() => {
    return () => {
      if (pendingRef.current) {
        URL.revokeObjectURL(pendingRef.current)
      }
    }
  }, [])

  // Clear the input so re-picking the same file still fires a change event, and
  // drop any stale upload error now that the value moved underneath it.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setLocalError(null)
  }, [value.length])

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const picked = Array.from(files)
      const invalid = picked.map(validateImageFile).find(Boolean)
      if (invalid) {
        setLocalError(invalid)
        return
      }

      setLocalError(null)
      setUploading(true)
      setPreview(URL.createObjectURL(picked[0]))

      // Sequential on purpose: a 3-image batch that fails on the third should
      // still keep the first two rather than discard the whole batch.
      const uploaded: string[] = []
      let failure: string | null = null

      for (const file of picked) {
        try {
          uploaded.push(await uploadFile(file))
        } catch (err) {
          failure = err instanceof Error ? err.message : 'No se pudo subir la imagen.'
          break
        }
      }

      if (uploaded.length > 0) {
        onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1))
      }

      setLocalError(failure)
      setUploading(false)
      setPreview(null)
    },
    [multiple, onChange, value, setPreview],
  )

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const empty = value.length === 0 && !pendingPreview

  // The form's own error ("Subí una imagen de portada") wins over a leftover
  // upload error: the missing value is the thing the user has to act on.
  const visibleError = error || localError
  const hasError = Boolean(visibleError)

  return (
    <div id={id} className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </span>
        <span className="text-xs text-muted-foreground/70">
          JPG, PNG, WebP, AVIF o GIF · máx. 10 MB
        </span>
      </div>

      {value.length > 0 && (
        <ul
          className={cn(
            'grid gap-2',
            multiple ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-1',
          )}
        >
          {value.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className={cn(
                'group relative overflow-hidden rounded-lg border border-border bg-muted',
                !multiple && 'aspect-[4/3]',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className={cn(
                  'size-full object-cover',
                  !multiple && 'absolute inset-0',
                )}
              />

              {!multiple && (
                <span className="absolute top-2 left-2 rounded-md bg-background/75 px-2 py-1 text-[0.7rem] font-medium text-foreground backdrop-blur-sm">
                  Portada
                </span>
              )}

              {/* Always visible on touch, revealed on hover for pointer devices. */}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Quitar imagen"
                className="absolute top-2 right-2 grid size-7 place-items-center rounded-md bg-background/75 text-foreground opacity-100 backdrop-blur-sm transition hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:opacity-0 sm:group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {pendingPreview && (
        <div className="relative overflow-hidden rounded-lg border border-ring/50 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingPreview}
            alt="Vista previa"
            className={cn(
              'w-full object-cover',
              multiple ? 'aspect-square' : 'aspect-[4/3]',
            )}
          />
          <div className="absolute inset-0 grid place-items-center gap-2 bg-background/65 backdrop-blur-[2px]">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            <span className="text-xs font-medium text-foreground">
              Subiendo imagen…
            </span>
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'rounded-lg border-2 border-dashed transition-colors duration-150',
          // Drag feedback outranks the error tint, otherwise the zone stops
          // reading as invalid the moment the user drags a file over it.
          dragging
            ? 'border-primary bg-primary/10'
            : hasError
              ? 'border-destructive/60 bg-destructive/5'
              : 'border-input hover:border-white/25',
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_EXTENSIONS}
          multiple={multiple}
          onChange={(e) => void handleFiles(e.target.files)}
          className="sr-only"
        />

        <label
          htmlFor={inputId}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-1.5 px-4 text-center',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-card',
            empty ? 'py-10' : 'py-4',
          )}
        >
          {empty ? (
            <>
              <span
                className={cn(
                  'grid size-11 place-items-center rounded-full border transition-colors',
                  dragging
                    ? 'border-primary text-primary'
                    : 'border-border text-muted-foreground',
                )}
              >
                {uploading ? (
                  <LoaderCircle className="size-5 animate-spin" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </span>
              <span className="text-sm font-medium text-foreground">
                {uploading ? 'Subiendo…' : 'Arrastrá una imagen o hacé clic'}
              </span>
              <span className="text-xs text-muted-foreground">
                La vista previa aparece al instante
              </span>
            </>
          ) : (
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              {uploading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              {multiple ? 'Agregar más imágenes' : 'Reemplazar imagen'}
            </span>
          )}
        </label>
      </div>

      {uploading && (
        <div
          role="progressbar"
          aria-label="Subiendo imagen"
          className="h-0.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      )}

      {visibleError && (
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <CircleAlert className="mt-px size-3.5 shrink-0" />
          <span>{visibleError}</span>
        </p>
      )}

      {!visibleError && hint && (
        <p className="text-xs text-muted-foreground/80">{hint}</p>
      )}
    </div>
  )
}
