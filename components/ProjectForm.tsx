"use client"

import {ProjectInterface, SessionInterface} from "@/common.types";
import {ChangeEvent, useState} from "react";
import Image from "next/image";
import FormField from "@/components/FormField";
import {categoryFilters} from "@/constants";
import CustomMenu from "@/components/CustomMenu";
import Button from "@/components/Button";
import {useRouter} from "next/navigation";//TODO: check if its from next/router or next/navigation
import {createNewProject, fetchToken, updateProject} from "@/lib/actions";

type Props = {
    type: string,
    session: SessionInterface,
    project?: ProjectInterface
}
const TAG: string = "##@@ProjectForm.tsx"
const ProjectForm = ({type, session, project}: Props) => {
    const router = useRouter();

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();//Reason--> default behaviour of browser is to reload page we want to prevent that
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.includes('image')) {
            return alert('Please upload an image file');
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            handleStateChange('image', result);
        }
    }

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prev) => (
            {...prev, [fieldName]: value}
        ))
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const {token} = await fetchToken();
        try {
            if (type === 'create') {
                await createNewProject(form, session?.user?.id, token);
                router.push("/");
            }
            if (type === 'edit') {
                await updateProject(form, project?.id as string, token);
                router.push("/");
            }
        } catch (error: any) {
            console.log(`${TAG} hnadleFormSubmit error occurred: ${error}`)
            alert(`Failed to ${type === "create" ? "create" : "edit"} a project. Try again!`);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        image: project?.image || '',
        title: project?.title || '',
        description: project?.description || '',
        liveSiteUrl: project?.liveSiteUrl || '',
        githubUrl: project?.githubUrl || '',
        category: project?.category || ''
    })

    return (
        <form onSubmit={handleFormSubmit} className="flexStart form">
            <div className="flexStart form_image-container">
                <label htmlFor="poster" className="flexCenter form_image-label">
                    {!form.image && 'Choose a Poster for your project'}
                </label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    required={type === 'create'}
                    className="form_image-input"
                    onChange={handleChangeImage}
                />
                {form.image && (
                    <Image src={form?.image} className="sm:p-10 object-contain z-20" alt="Project poster" fill/>
                )}
            </div>
            <FormField
                title="Title"
                state={form.title}
                placeholder="Inspire Shot"
                setState={(value) => handleStateChange('title', value)}
            />
            <FormField
                title="Description"
                state={form.description}
                placeholder="Showcase and Discover remarkable developer projects."
                setState={(value) => handleStateChange('description', value)}
            />
            <FormField
                type="url"
                title="Website url"
                state={form.liveSiteUrl}
                placeholder="https://your-site-url.com"
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />
            <FormField
                type="url"
                title="Github Url"
                state={form.githubUrl}
                placeholder="https://github.com/Joaquin144/Inspire-Shot"
                setState={(value) => handleStateChange('githubUrl', value)}
            />

            <CustomMenu
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />

            <div className="flexStart w-full">
                <Button
                    title={isSubmitting ? `${type === "create" ? "Creating" : "Editing"}` : `${type === "create" ? "Create" : "Edit"}`}
                    type="submit"
                    leftIcon={isSubmitting ? "" : "/plus.svg"}
                    submitting={isSubmitting}
                />
            </div>
        </form>
    );
};

export default ProjectForm;