"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const UpgradePregnancyStage = () => {
  const [currentStage, setCurrentStage] = useState({
    week: 24,
    trimester: 'Second',
    babyLength: '12 inches',
    babyWeight: '1.3 pounds'
  })

  const handleUpgrade = () => {
    // Logic to upgrade to next stage
    console.log('Upgrading to next pregnancy stage...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-8 w-full">
      {/* Header */}
      <div className="py-6 px-6">
          <h1 className="text-3xl font-bold text-gray-800">Upgrade Pregnancy Stage</h1>
    </div>

      {/* Main Card */}
      <div className="p-6 w-full">
        <Card className="bg-white shadow-2xl rounded-3xl w-full mx-auto max-w-4xl">
        <CardContent className="p-12">
          {/* Current Stage Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Your Current Pregnancy Stage
            </h2>
            
            <Badge 
              className="px-10 py-4 text-xl font-semibold bg-green-500 hover:bg-green-600 text-white rounded-full inline-block mb-8"
            >
              Week {currentStage.week} - {currentStage.trimester} Trimester
            </Badge>

            <p className="text-gray-600 text-lg leading-relaxed mb-10 px-4">
              You are currently in your {currentStage.trimester.toLowerCase()} trimester. Your baby is about{' '}
              {currentStage.babyLength} long and weighs approximately {currentStage.babyWeight}. 
              Ready to update to the next stage?
            </p>

            {/* Upgrade Button */}
            <Button 
              onClick={handleUpgrade}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-xl px-16 py-7 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Upgrade to Next Pregnancy Stage
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default UpgradePregnancyStage