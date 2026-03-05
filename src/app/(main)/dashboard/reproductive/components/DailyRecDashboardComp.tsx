// import Container from "@/components/shared/container"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useState } from "react"
// import { useCycleStats } from "@/hooks/useCycleStats"
// import { useRouter } from "next/navigation"

// function DailyRecDashboardComp() {

//     const [checkedItems, setCheckedItems] = useState<string[]>([])
//     const [isPopupOpen, setIsPopupOpen] = useState(false)

//     const { loading, error, stats } = useCycleStats();

//     const router = useRouter();

//     const handleCheckboxChange = (id: string, checked: boolean) => {
//         if (checked) {
//             setCheckedItems((prev) => [...prev, id])
//         } else {
//             setCheckedItems((prev) => prev.filter((item) => item !== id))
//         }
//     }

//     return (
//         <div>
//             <Card className="bg-white/90 backdrop-blur">
//                 <CardHeader>
//                     <CardTitle className="text-pink-600 flex items-center gap-2 text-sm md:text-base">
//                         Today&apos;s Recommendations
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="bg-green-50 p-3 md:p-4 rounded-lg space-y-3">
//                         <div className="flex items-start gap-3">
//                             <Checkbox
//                                 id="water"
//                                 className="mt-1"
//                                 checked={checkedItems.includes("water")}
//                                 onCheckedChange={(checked) => handleCheckboxChange("water", checked as boolean)}
//                             />
//                             <div>
//                                 <label htmlFor="water" className="font-medium text-sm">
//                                     Drink 8 glasses of water today
//                                 </label>
//                                 <p className="text-xs text-gray-600">Stay hydrated for optimal reproductive health</p>
//                             </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                             <Checkbox
//                                 id="vitamins"
//                                 className="mt-1"
//                                 checked={checkedItems.includes("vitamins")}
//                                 onCheckedChange={(checked) => handleCheckboxChange("vitamins", checked as boolean)}
//                             />
//                             <div>
//                                 <label htmlFor="vitamins" className="font-medium text-sm">
//                                     Take prenatal vitamins
//                                 </label>
//                                 <p className="text-xs text-gray-600">Ensure adequate folic acid intake</p>
//                             </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                             <Checkbox
//                                 id="exercise"
//                                 className="mt-1"
//                                 checked={checkedItems.includes("exercise")}
//                                 onCheckedChange={(checked) => handleCheckboxChange("exercise", checked as boolean)}
//                             />
//                             <div>
//                                 <label htmlFor="exercise" className="font-medium text-sm">
//                                     30 minutes of light exercise
//                                 </label>
//                                 <p className="text-xs text-gray-600">Boost fertility with gentle movement</p>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// export default DailyRecDashboardComp