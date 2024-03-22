const Banner: React.FC = () => {
    return (
        <div>
            <p className="animate-gradient dark:animate-gradient pt-3 text-center dark:bg-jacarta-100 font-bold ">
                A-NFT.World web version Alpha 1.0
            </p>
            <p className="text-center mt-2">
                <span className="animate-gradient dark:animate-gradient ">For inquiries open a ticket on</span>
                <a
                    className="border px-2 py-1 rounded-lg dark:text-accent hover:underline hover:bg-accent dark:hover:text-white ml-2 "
                    href="https://discord.gg/7PFSgdvkn3"
                >
                    Discord
                </a>
            </p>
        </div>
    );
};

export default Banner;
