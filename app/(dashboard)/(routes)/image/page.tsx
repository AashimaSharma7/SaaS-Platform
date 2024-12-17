"use client";
import * as z from "zod";
import axios from "axios";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Heading } from "@/components/heading";
import { ImageIcon, MessagesSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChatCompletion from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProModal } from "@/hooks/use-pro-modal";
// import ChatCompletionMessageParam from "openai"

// type ChatCompletionMessageParam = {
//     role: "user"; // Valid roles
//     content: string; // The message content
// };
const ImagePage=() => {
    const proModal= useProModal();
    const router = useRouter();
    const [images, setImages]= useState<string[]>([]);
    // const [messages, setMessages]= useState<ChatCompletionMessageParam[]>([]);
    const form=useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt:"",
            amount:"1",
            resolution:"512x512"
        }
    });
    const isLoading= form.formState.isSubmitting;

    const onSubmit= async(values: z.infer<typeof formSchema>)=>{
        try{
            setImages([]);
            

            // const userMessage: ChatCompletionMessageParam={
            //     role: "user",
            //     content: values.prompt,

            // };
            // const newMessages = [...messages, userMessage];
            const response = await axios.post("/api/image", values);

            const urls = response.data.map((image: {url: string })=> image.url );

            setImages(urls);
            // setMessages((current)=> [...current, userMessage, response.data ]);

            form.reset();
            
        }catch(error :any){
            if (error?.response?.status===403){
                proModal.onOpen();

            }

        } finally{
            router.refresh();

        }
    };



    return( 
        <div className=" h-full relative">
            <Heading
            title="Image Generation"
            description="Turn your prompt into an image"
            icon={ImageIcon}
            iconColor="text-pink-700"
            bgColor="bg-pink-700/10"/>
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="
                          rounded-lg
                          border
                          w-full
                          p-4
                          px-3
                          md:px-6
                          focus-within:shadow-sm
                          grid
                          grid-cols-12
                          gap-2
                          " >
                            <FormField
                            name="prompt"
                            render={({field})=> (
                                <FormItem className="col-span-12 lg:col-span-6">
                                    <FormControl className="m-0 p-0">
                                        <Input 
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="Picture of a horse in a swimming pool"
                                        {...field}
                                    
                                        
                                        />

                                    </FormControl>

                                </FormItem>
                            )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({field})=> (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                   <SelectValue defaultValue={field.value}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option)=>(
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}

                                                    </SelectItem>

                                                ))}

                                            </SelectContent>

                                        </Select>

                                    </FormItem>
                                )}
                            
                            />

                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({field})=> (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                   <SelectValue defaultValue={field.value}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option)=>(
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}

                                                    </SelectItem>

                                                ))}

                                            </SelectContent>

                                        </Select>

                                    </FormItem>
                                )}
                            
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full"
                            disabled={isLoading}>
                                Generate
                            </Button>
                        </form>

                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading &&(
                       <div className="p-20">
                        <Loader/>

                       </div> 
                    )}
                    {images.length ===0 && !isLoading && (
                        <Empty label="No images generated"/>
                    )}
                    <div>
                        Images will be rendered here
                    </div>

                </div>


            </div>
        
        
        </div>
        
    );
}
export default ImagePage;