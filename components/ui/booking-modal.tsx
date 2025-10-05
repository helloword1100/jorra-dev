"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [currentStep, setCurrentStep] = useState(1)

    console.log("BookingModal render - isOpen:", isOpen)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        postCode: "",
        phoneNumber: "",
        emailAddress: "",
        receiveReminders: false
    })
    const router = useRouter()

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleNext = () => {
        if (currentStep === 1) {
            // Validate form fields
            const { firstName, lastName, postCode, phoneNumber, emailAddress } = formData
            if (firstName && lastName && postCode && phoneNumber && emailAddress) {
                setCurrentStep(2)
            }
        }
    }

    const handleConfirmBooking = () => {
        // Simulate booking process
        setTimeout(() => {
            onClose()
            router.push('/dashboard')
        }, 2000)
    }

    const isFormValid = () => {
        const { firstName, lastName, postCode, phoneNumber, emailAddress } = formData
        return firstName && lastName && postCode && phoneNumber && emailAddress
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                {currentStep === 1 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Calendar className="h-5 w-5 text-[#F13DD4]" />
                                Book a Hair Appointment
                            </DialogTitle>
                            <p className="text-sm text-gray-600 mt-2">
                                Step 1 - kindly fill in your personal information
                            </p>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="firstName" className="text-sm font-medium">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="text-sm font-medium">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="postCode" className="text-sm font-medium">
                                        Post Code
                                    </Label>
                                    <Input
                                        id="postCode"
                                        placeholder="12345"
                                        value={formData.postCode}
                                        onChange={(e) => handleInputChange("postCode", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phoneNumber"
                                        placeholder="XXX-XXX-XXXX"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="emailAddress" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="emailAddress"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={formData.emailAddress}
                                    onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                                <Checkbox
                                    id="reminders"
                                    checked={formData.receiveReminders}
                                    onCheckedChange={(checked: boolean) => handleInputChange("receiveReminders", checked)}
                                    className="border-[#F13DD4] data-[state=checked]:bg-[#F13DD4]"
                                />
                                <Label htmlFor="reminders" className="text-sm text-gray-600">
                                    I want to receive booking reminders via email
                                </Label>
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!isFormValid()}
                                className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-center gap-2 text-xl font-bold text-green-600">
                                <CheckCircle className="h-6 w-6" />
                                Booking Received!
                            </DialogTitle>
                        </DialogHeader>

                        <div className="text-center py-6 space-y-4">
                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">
                                    Thank You, {formData.firstName}!
                                </h3>
                                <p className="text-green-700">
                                    We have received your booking request and will contact you shortly to confirm your appointment.
                                </p>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                                <p>📧 Confirmation details will be sent to:</p>
                                <p className="font-medium">{formData.emailAddress}</p>
                                <p>📱 We'll call you at: <span className="font-medium">{formData.phoneNumber}</span></p>
                            </div>

                            <Button
                                onClick={handleConfirmBooking}
                                className="w-full mt-6 bg-[#F13DD4] hover:bg-[#E532C8] text-white py-3 rounded-lg font-medium"
                            >
                                Continue to Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}