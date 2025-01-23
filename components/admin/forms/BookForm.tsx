"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, Field, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FIELD_NAMES, FIELD_TYPES } from '@/constants';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/navigation';
import { Book } from '@/types';
import { bookSchema } from '@/lib/validations';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/FileUpload';
import ColorPicker from '../ColorPicker';

interface Props extends Partial<Book>{
  type?: "create" | "update";
}

const BookForm=({
  type,
 ...book
}:Props) => {

  const router = useRouter();

  const form=useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues:{
      title: "",
      description: "",
      author: "",
      genre: "",
      rating: 1,
      totalCopies: 1,
      coverUrl: "",
      coverColor: "",
      videoUrl: "",
      summary: "",
}
})

const onSubmit = async(values: z.infer<typeof bookSchema>) => {
  console.log(values)
}

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField 
            control={form.control}
            name={"title"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Book Title</FormLabel>
                <FormControl>
                    <Input 
                    required 
                    placeholder='Book Title'
                    {...field}
                    type={
                      FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                     {...field} 
                      className='book-form_input'
                     />      
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"author"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Author</FormLabel>
                <FormControl>
                    <Input 
                    required 
                    placeholder='Book Author'
                    {...field}
                    type={
                      FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                     {...field} 
                      className='book-form_input'
                     />      
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"genre"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Genre</FormLabel>
                <FormControl>
                    <Input 
                    required 
                    placeholder='Book Genre'
                    {...field}
                    type={
                      FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                     {...field} 
                      className='book-form_input'
                     />      
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"rating"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Rating</FormLabel>
                <FormControl>
                    <Input 
                    type="number" 
                    min={1}
                    max={5}
                    placeholder='Book Rating'
                    {...field}
                  
                      className='book-form_input'
                     />      
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"totalCopies"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Total Copies</FormLabel>
                <FormControl>
                    <Input 
                    type="number" 
                    min={1}
                    max={10000}
                    placeholder='Book Rating'
                    {...field}
                    
                      className='book-form_input'
                     />      
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"coverUrl"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Book Image</FormLabel>
                <FormControl>
                    <FileUpload type="image" accept="image/*" placeholder="Upload a book cover" folder="books/covers" variant="light" onFileChange={field.onChange} value={field.value}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"coverColor"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Primary Color</FormLabel>
                <FormControl>
                <ColorPicker onPickerChange={field.onChange} value={field.value}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Book Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Book Description' {...field} rows={10} className='book-form_input'/>
                  
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"videoUrl"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Video Trailer</FormLabel>
                <FormControl>
                <FileUpload type="video" 
                accept="video/*" 
                placeholder="Upload a Video Trailer"
                folder="books/videos" 
                variant="light" 
                onFileChange={field.onChange} 
                value={field.value}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name={"summary"}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='text-base font-normal text-dark-500'>Book Summary</FormLabel>
                <FormControl>
                  <Textarea placeholder='Book Description' {...field} rows={5} className='book-form_input'/>
                    {/* Color Picker Component */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='book-form_btn text-white'>Add Book to Library</Button>
      </form>
    </Form>
    
  )
}


export default BookForm