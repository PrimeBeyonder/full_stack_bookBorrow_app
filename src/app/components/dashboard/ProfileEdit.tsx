"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/app/actions/user"

interface User {
  id: string
  name: string
  bio: string
  avatar: string | null
}

export function ProfileEdit({ user }: { user: User }) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (fileInputRef.current?.files?.[0]) {
      formData.append("avatar", fileInputRef.current.files[0])
    }

    const result = await updateUserProfile(formData)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      router.push("/dashboard/user")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar</Label>
        <div className="flex items-center space-x-4">
          <Image
            src={avatarPreview || "/placeholder.svg"}
            alt="Avatar preview"
            width={60}
            height={60}
            className="rounded-full"
          />
          <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={user.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={user.bio || ""} />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}

