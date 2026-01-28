import { Request,Response } from 'express';
import prisma from '../lib/prisma.js';
// get user Credits
export const getUserCredits = async (req: Request,res:Response) => {
    try {
        const userId=req.userId;
        if(!userId){
            return res.status(401).json({message:'Unauthorized'});
        }
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })

    } catch (error:any) {
        console.log(error.code || error.message);
        res.status(500).json({message:error.message});
    }
}

// controller function to add credits to user

export const createUserProject = async (req: Request,res:Response) => {
    const userId=req.userId;
    try {
        const {initial_prompt}=req.body;
        if(!userId){
            return res.status(401).json({message:'Unauthorized'});
        }
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })
        if(user && user.credits <5){
            return res.status(403).json({message:'Insufficient credits add credits to create more projects'});
        }

        // create a new project
        const project = await prisma.websiteProject.create({
            data:{
                name:initial_prompt.lenght>50 ? initial_prompt.substring(0,47)+'...' : initial_prompt,
                userId
            }
        })

        // update users total creation
        await prisma .user.update({
            where:{id:userId},
            data:{
                totalCreations: {increment:1},
            }
        })

        await prisma.conversation.create({
            data:{
                role:'user',
                content:initial_prompt,
                projectId:project.id
            }
        })

        await prisma.user.update({
            where:{id:userId},
            data:{
                credits:{decrement:5}
            }
        })
        res.json({projectId:project.id})
    } catch (error:any) {
        console.log(error.code || error.message);
        res.status(500).json({message:error.message});
    }
}