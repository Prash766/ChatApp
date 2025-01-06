import { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface MediaGalleryProps {
  media: string[]
  isDarkTheme: boolean
}

export default function MediaGallery({ media, isDarkTheme }: MediaGalleryProps) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const openCarousel = (index: number) => {
    setCurrentMediaIndex(index)
    setIsCarouselOpen(true)
  }

  const renderMedia = () => {
    const mediaCount = media.length

    if (mediaCount === 1) {
      return (
        <div className="relative max-w-[320px] max-h-[400px] min-w-[200px]" onClick={() => openCarousel(0)}>
          <div className="relative w-full h-full">
            {isVideo(media[0]) ? (
              <video 
                src={media[0]} 
                controls
                className="w-full h-full object-cover rounded-lg border border-gray-300"
                style={{ maxHeight: '400px', minHeight: '200px' }}
              />
            ) : (
              <img 
                src={media[0]} 
                alt="Single media" 
                className="w-full h-full object-cover rounded-lg border border-gray-300"
                style={{ maxHeight: '400px', minHeight: '200px' }}
              />
            )}
          </div>
        </div>
      )
    }

    if (mediaCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 max-w-[400px]">
          {media.map((item, index) => (
            <div 
              key={index} 
              className="relative aspect-square" 
              onClick={() => openCarousel(index)}
            >
              {isVideo(item) ? (
                <video 
                  src={item} 
                  controls
                  className="w-full h-full object-cover rounded-lg border border-gray-300"
                />
              ) : (
                <img 
                  src={item} 
                  alt={`Media ${index + 1}`} 
                  className="w-full h-full object-cover rounded-lg border border-gray-300"
                />
              )}
            </div>
          ))}
        </div>
      )
    }

    if (mediaCount === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 max-w-[400px]">
          <div 
            className="relative aspect-square" 
            onClick={() => openCarousel(0)}
          >
            {isVideo(media[0]) ? (
              <video 
                src={media[0]} 
                controls
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <img 
                src={media[0]} 
                alt="Media 1" 
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
            )}
          </div>
          <div className="grid grid-rows-2 gap-1">
            {media.slice(1).map((item, index) => (
              <div 
                key={index} 
                className="relative aspect-[4/3]" 
                onClick={() => openCarousel(index + 1)}
              >
                {isVideo(item) ? (
                  <video 
                    src={item} 
                    controls
                    className="w-full h-full object-cover rounded-lg border border-gray-300"
                  />
                ) : (
                  <img 
                    src={item} 
                    alt={`Media ${index + 2}`} 
                    className="w-full h-full object-cover rounded-lg border border-gray-300"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }

    // 4 or more media items
    return (
      <div className="grid grid-cols-2 gap-1 max-w-[400px]">
        {media.slice(0, 4).map((item, index) => (
          <div 
            key={index} 
            className="relative aspect-square" 
            onClick={() => openCarousel(index)}
          >
            {isVideo(item) ? (
              <video 
                src={item} 
                controls
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <img 
                src={item} 
                alt={`Media ${index + 1}`} 
                className="w-full h-full object-cover rounded-lg border border-gray-300"
              />
            )}
            {index === 3 && mediaCount > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg border border-gray-300">
                <span className="text-white text-2xl font-bold">+{mediaCount - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const isVideo = (url: string) => {
    return url?.toLowerCase().endsWith('.mp4')
  }

  return (
    <>
      {renderMedia()}

      <Dialog open={isCarouselOpen} onOpenChange={setIsCarouselOpen}>
        <DialogContent className="max-w-[90vw] w-full p-3 bg-black/90 text-white  border-none">
          <Carousel className="w-full text-white">
            <CarouselContent>
              {media.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center">
                    {isVideo(item) ? (
                      <video
                        src={item}
                        controls
                        className="max-w-full max-h-[80vh] object-contain rounded-lg border border-gray-300"
                      />
                    ) : (
                      <img
                        src={item}
                        alt={`Media ${index + 1}`}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg border border-gray-300"
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-black " />
            <CarouselNext className="text-black " />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}