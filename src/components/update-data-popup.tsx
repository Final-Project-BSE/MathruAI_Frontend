import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UpdateDataPopup({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    weight: "",
    bloodPressure: "",
    heartRate: "",
    cycleDay: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form data:", formData)
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-4 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Update Your Data</h2>
          <p className="text-sm text-white/90">Keep your health information current</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cycleDay">Current Cycle Day</Label>
            <Input
              id="cycleDay"
              type="number"
              placeholder="Enter cycle day (1-28)"
              value={formData.cycleDay}
              onChange={(e) => handleChange("cycleDay", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
            <Input
              id="bloodPressure"
              type="text"
              placeholder="e.g., 120/80"
              value={formData.bloodPressure}
              onChange={(e) => handleChange("bloodPressure", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
            <Input
              id="heartRate"
              type="number"
              placeholder="Enter heart rate"
              value={formData.heartRate}
              onChange={(e) => handleChange("heartRate", e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}