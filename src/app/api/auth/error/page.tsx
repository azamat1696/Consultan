export default function Page() {
  return (
     
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">There was a problem with your authentication.</p>
        <a 
          href="/signin"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Sign In
        </a>
      </div>
    </div>
  )
}
