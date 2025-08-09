import Lottie from "lottie-react";
import loading_animation from '../assets/Loading.json'

export default function Loading() {
  return (
    <div className="flex justify-center mt-4 h-60 w-60 items-center">
      <Lottie animationData={loading_animation}/>
    </div>
  );
}
