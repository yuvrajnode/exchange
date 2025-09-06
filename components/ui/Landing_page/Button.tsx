// ...existing code...
type ButtonProps = {
  name: string;
};

export default function Button({ name }: ButtonProps) {
  return <button 
className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded-4xl h-[50px] w-[80px]">{name}</button>;
}
// ...existing code...
