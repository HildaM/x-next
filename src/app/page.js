import Input from '@/components/Input'
import React from 'react'

export default function page() {
    return (
      <div className='max-w-xl mx-auto border-l min-h-screen'>
        <div className='py-2 px-2 sticky top-0 z-50 bg-white border-b border-gr20'>
          <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
        </div>

        <Input />
      </div>
    )
}
