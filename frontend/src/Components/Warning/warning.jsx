// eslint-disable-next-line react/prop-types
function Warning({onClose}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-red-600 text-3xl font-bold">
            Exam over
        </h1>
        <p className="text-gray-700 mt-2">
        You switched tabs or lost focus. Please stay on the exam screen.
        </p>
        <button 
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
                OK
        </button>
        </div>
    </div>
  )
}

export default Warning