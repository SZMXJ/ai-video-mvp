export default function PricingPage() {
    return (
      <main className="min-h-screen bg-black text-white px-6 pt-24 text-center">
        <h1 className="text-4xl font-bold mb-6">Pricing</h1>
        <p className="text-gray-400 mb-12">
          Simple pricing. Pay only when you need more.
        </p>
  
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-900 p-8 rounded-xl">
            <h2 className="text-xl mb-4">Free</h2>
            <p className="text-4xl mb-6">$0</p>
            <p className="text-gray-400 mb-6">3 videos / day</p>
            <button className="border border-neutral-700 px-6 py-2 rounded">
              Start Free
            </button>
          </div>
  
          <div className="bg-white text-black p-8 rounded-xl">
            <h2 className="text-xl mb-4">Pro</h2>
            <p className="text-4xl mb-6">$19</p>
            <p className="mb-6">100 videos / month</p>
            <button className="bg-black text-white px-6 py-2 rounded">
              Upgrade
            </button>
          </div>
  
          <div className="bg-neutral-900 p-8 rounded-xl">
            <h2 className="text-xl mb-4">Studio</h2>
            <p className="text-4xl mb-6">$49</p>
            <p className="text-gray-400 mb-6">Unlimited videos</p>
            <button className="border border-neutral-700 px-6 py-2 rounded">
              Contact Us
            </button>
          </div>
        </div>
      </main>
    );
  }
  