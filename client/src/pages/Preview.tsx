import { dummyProjects } from '@/assets/assets';
import ProjectPreview from '@/components/ProjectPreview';
import { authClient } from '@/lib/auth-client';
import type { Project, Version } from '@/types';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Preview = () => {
  const {data:session,isPending}=authClient.useSession();
   const {projectId,versionId} =useParams();
  const [code,setCode]=useState('')
  const [loading,setLoading]=useState(true)

   const fetchCode=async()=>{
    //  setTimeout(()=>{
    //     const code=dummyProjects.find(project=>project.id===projectId)?.current_code;
    //     if(code){
    //       setCode(code);
    //       setLoading(false)
    //     }
    //   },2000)
    try {
      const {data}=await api.get(`/api/project/preview/${projectId}`)
      setCode(data.project.current_code)
      if(versionId){
        data.project.version.forEach((version:Version)=>{
          if(version.id===versionId){
            setCode(version.code)
          }
        })
      }
      setLoading(false)
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error.message)
      console.log(error);
    }
    }
  
    useEffect(()=>{
      // fetchCode()
      if(!isPending && session?.user){
        fetchCode()
      }
    },[session?.user])
    if(loading){
    return(
      <div className='flex items-center justify-centre h-screen'>
        <Loader2Icon className='size-7 animate-spin text-indigo-200'/>
      </div>
    )
  }
  return (
   <div className='h-screen'>
      {code && <ProjectPreview  project={{current_code:code} as Project}
      isGenerating={false} showEditorPanel={false}/>}
    </div>
  )
}

export default Preview