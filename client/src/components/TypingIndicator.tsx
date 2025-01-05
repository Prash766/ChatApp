
const TypingIndicator = () => {
  return (
  <div className="flex items-start p-2 ml-2">
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 flex gap-2 items-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>  )
}

export default TypingIndicator