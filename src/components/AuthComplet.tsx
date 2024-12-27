'use client'

import { cn } from '@/lib/utils'
import debounce from 'debounce'
import { Loader, MapPin, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'

type OptionItem = {
   label: string
   value: string
}

export const AuthComplet = () => {
   const contentRef = useRef<HTMLDivElement>(null)

   const [open, setOpen] = useState(false)
   const [query, setQuery] = useState<string>('')
   const [content, setContent] = useState<OptionItem[]>([])
   const [loading, setLoading] = useState<boolean>(false)
   const [focusIndex, setFocusIndex] = useState<{ index: number; type: 'mouse' | 'keydown' }>({
      index: 0,
      type: 'mouse',
   })
   const [direction, setDirection] = useState<number>(1)
   const [isEdited, setIsEdited] = useState<boolean>(false)

   const handleSelected = useCallback(
      (value: string) => {
         const option = content.find((item) => item.value === value)
         console.log('Selected option: ', option)
         setOpen(false)
         if (option) setQuery(option.label)
      },
      [content]
   )

   const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (e.key === 'ArrowDown') {
            e.preventDefault()
            setFocusIndex((prev) => ({
               type: 'keydown',
               index: prev.index < content.length - 1 ? prev.index + 1 : prev.index,
            }))
            setDirection(-1)
         } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setFocusIndex((prev) => ({ type: 'keydown', index: prev.index > 0 ? prev.index - 1 : 0 }))
            setDirection(1)
         } else if ((e.key === 'Enter' || e.key === 'Escape') && focusIndex.index >= 0) {
            handleSelected(content[focusIndex.index].value)
         }
      },
      [content, focusIndex, handleSelected]
   )

   const fetchData = useCallback(
      debounce((value: string) => {
         console.log('Query => ', value)
         if (value && isEdited) {
            setOpen(true)
            setLoading(true)
            setIsEdited(false)
            setTimeout(() => {
               setContent([
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' },
                  { label: 'Option 3', value: '3' },
                  { label: 'Option 4', value: '4' },
                  { label: 'Option 5', value: '5' },
                  { label: 'Option 6', value: '6' },
                  { label: 'Option 7', value: '7' },
                  { label: 'Option 8', value: '8' },
                  { label: 'Option 9', value: '9' },
                  { label: 'Option 10', value: '10' },
               ])
               setLoading(false)
            }, 1000)
         } else {
            setContent([])
         }
      }, 500),
      [open, isEdited]
   )

   useEffect(() => {
      fetchData(query)
   }, [fetchData, query])

   useEffect(() => {
      if (contentRef.current && focusIndex.type === 'keydown') {
         const top = 50 * focusIndex.index
         if (top > 200 && direction === -1) contentRef.current.scrollTo({ top })
         if (top < 300 && direction === 1) contentRef.current.scrollTo({ top: top - 50 })
      }
   }, [direction, focusIndex])

   return (
      <div className='relative'>
         <div className='relative'>
            <Input
               onBlur={() => setTimeout(() => setOpen(false), 200)}
               onKeyDown={handleKeyDown}
               className='pl-10 w-full py-3 rounded-lg'
               placeholder='Search element...'
               value={query}
               onChange={(e) => {
                  setQuery(e.target.value)
                  setIsEdited(true)
               }}
            />
            <div className='absolute top-0 bottom-0 left-0 w-10 flex justify-center items-center'>
               <Search className='size-4 text-muted-foreground' />
            </div>
         </div>
         {open && (
            <Card className='absolute top-full mt-[8px] left-0 right-0 z-50'>
               <CardContent ref={contentRef} className='flex flex-wrap p-0 max-h-[250px] overflow-y-auto'>
                  {loading && (
                     <div className='flex justify-center items-center h-20 w-full'>
                        <Loader className='size-7 animate-spin text-muted-foreground' />
                     </div>
                  )}
                  {!loading &&
                     content.map((item, index) => (
                        <div
                           key={item.value}
                           onClick={() => handleSelected(item.value)}
                           onMouseEnter={() => setFocusIndex({ index, type: 'mouse' })}
                           className={cn('w-full flex gap-2 items-center py-3 px-4 cursor-pointer', {
                              'bg-accent/70': focusIndex.index === index,
                           })}
                        >
                           <MapPin className='size-4 text-muted-foreground' />
                           {item.label}
                        </div>
                     ))}
               </CardContent>
            </Card>
         )}
      </div>
   )
}
