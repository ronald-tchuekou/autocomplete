'use client'

import { cn } from '@/lib/utils'
import { Calculator, Calendar, Smile } from 'lucide-react'
import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

type OptionItem = {
   label: string
   value: string
}

export const AuthComplet2 = () => {
   const [open, setOpen] = useState(false)
   const [content, setContent] = useState<OptionItem[]>([])

   return (
      <div className='relative'>
         <div className='h-12 w-full' />
         <div className='absolute top-0 left-0 right-0'>
            <Command className={cn('rounded-lg border w-full', { 'shadow-md': open })}>
               <CommandInput
                  onFocus={() => setOpen(true)}
                  onBlur={() => setOpen(false)}
                  placeholder='Type a command or search...'
               />
               {open && (
                  <CommandList>
                     <CommandEmpty>No results found.</CommandEmpty>
                     <CommandGroup heading='Suggestions'>
                        <CommandItem onSelect={() => setOpen(false)}>
                           <Calendar />
                           <span>Calendar</span>
                        </CommandItem>
                        <CommandItem>
                           <Smile />
                           <span>Search Emoji</span>
                        </CommandItem>
                        <CommandItem disabled>
                           <Calculator />
                           <span>Calculator</span>
                        </CommandItem>
                     </CommandGroup>
                  </CommandList>
               )}
            </Command>
         </div>
      </div>
   )
}
