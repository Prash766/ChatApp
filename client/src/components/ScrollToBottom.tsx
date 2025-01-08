import { ChevronDown } from "lucide-react"

const ScrollToBottom = ({files , handleScrollToBottom}:{files: File[] , handleScrollToBottom :()=> void}) => {
    return (
      <div 
      onClick={handleScrollToBottom}
      className={`fixed ${files.length > 0  ?   "bottom-[15rem]" :  "bottom-[7rem]"}  flex items-center justify-center z-50 p-1 cursor-pointer w-10 h-10 rounded-full bg-black`}>
        <ChevronDown className="text-white" />
      </div>
    );
  };
  
  export default ScrollToBottom;
  