"use client";

import Button from '@/components/Button';

export default function ClaimItem() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Claim Item</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <p className="text-blue-700">
          To prevent theft, we need you to verify ownership. Please provide unique details about the item that aren't visible in the photo.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4">Item Details</h2>
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">📦</div>
          <div>
            <h3 className="font-medium text-lg">Black Leather Wallet</h3>
            <p className="text-gray-500">Found at Main Library</p>
            <p className="text-gray-500">Date: 2023-10-25</p>
          </div>
        </div>
      </div>
      
      <form className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-xl font-semibold mb-4">Verification</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Identifying Features</label>
          <p className="text-xs text-gray-500 mb-2">E.g., "Contains a library card with name John Doe" or "Has a small scratch on the back corner"</p>
          <textarea 
            rows="4"
            placeholder="Describe unique features..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proof (Optional)</label>
          <p className="text-xs text-gray-500 mb-2">Old photos of you with the item, purchase receipt, etc.</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <p className="text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 5MB</p>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Submit Claim for Review
          </Button>
        </div>
      </form>
    </div>
  );
}
