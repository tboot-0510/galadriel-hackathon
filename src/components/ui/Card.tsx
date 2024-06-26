export default function Card() {
    return (
        <div className="w-full items-stretch ">
            <p className="flex w-full border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <ul className="gap-4">
                <h2 className="text-sm font-bold">How to start</h2>
                <li>1. Connect your wallet to metamask</li>
                <li>2. Select your land on the map, select as many as you have (⚠️ Only select land within the US)</li>
                <li>3. Once selected proceed to check your insurance</li>
            </ul>
            
            </p>
        </div>
        
    )
}