import React from 'react';
import Image from 'next/image';
import Meta from '@/shared/components/meta/Meta';

const Terms = () => {
    return (
        <div>
            <Meta title="A-NFT.World" />
            <div className="pt-[5.5rem] lg:pt-24">
                <section className="dark:bg-jacarta-800 relative py-16 md:py-24 dark:text-white">
                    <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                        <Image
                            width={1519}
                            height={773}
                            priority
                            src="/images/gradient_light.jpg"
                            alt="gradient"
                            className="h-full w-full object-cover"
                        />
                    </picture>
                    <div className="container dark:bg-jacarta-700 dark:text-white dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-4 mb-6 pb-12 max-w-screen-lg mx-auto mt-24 py-12">
                        <h1 className="font-display text-jacarta-700 text-center text-4xl font-medium dark:text-white">
                            Terms of Service
                        </h1>
                        <div className="article-content mx-auto max-w-[48.125rem]">
                            <h2 className="text-lg mt-6 mb-2">Introduction</h2>
                            <p>
                                {
                                    "Welcome to A-NFT.World, a digital auction house facilitating the transaction of Non-Fungible Tokens (NFTs) and art. These Terms of Service outline the rules and regulations for the use of A-NFT.World's platform.By accessing this platform, you accept these terms and conditions. Please read them carefully before using A-NFT.World."
                                }
                            </p>
                            <h3 className="text-lg mt-6 mb-2">Acceptance of Terms </h3>
                            <p>
                                1.1. By accessing or using A-NFT.World, you agree to comply with and be bound by these
                                Terms of Service. 1.2. If you do not agree with any part of these terms, you may not
                                access the platform.
                            </p>
                            <h3 className="text-lg mt-6 mb-2">Platform Usage</h3>
                            <p>
                                2.1. A-NFT.World provides a platform for artists and users to buy, sell, and trade NFTs
                                and art. 2.2. Users must be at least 18 years old to access and use the platform. 2.3.
                                Users are solely responsible for all activities conducted through their accounts
                            </p>
                            <h3 className="text-lg mt-6 mb-2">User Conduct</h3>
                            <p>
                                3.1. Users agree not to engage in any unlawful, fraudulent, or malicious activities
                                while using A-NFT.World. 3.2. Users must not violate any laws or regulations applicable
                                to their use of the platform. 3.3. Users must respect the intellectual property rights
                                of others when uploading or trading NFTs and art.
                            </p>
                            <h3 className="text-lg mt-6 mb-2">Content Guidelines</h3>
                            <p>
                                4.1. Users are solely responsible for the content they upload to A-NFT.World. 4.2.
                                Content must not violate any laws or regulations or infringe upon the rights of any
                                third party. 4.3. A-NFT.World reserves the right to remove any content that violates
                                these guidelines without prior notice.
                            </p>

                            <h3 className="text-lg mt-6 mb-2">User Conduct</h3>

                            <p>
                                5.1. All transactions conducted through A-NFT.World are final. 5.2. A-NFT.World does not
                                guarantee the authenticity or quality of any NFTs or art listed on the platform.
                            </p>

                            <h3 className="text-lg mt-6 mb-2">Fees</h3>

                            <p>
                                6.1. A-NFT.World may charge fees for certain transactions conducted through the
                                platform. These fees will be clearly communicated to users before completing the
                                transaction.
                            </p>

                            <h2 className="text-lg mt-6 mb-2">Intellectual Property Rights</h2>

                            <p>
                                You are solely responsible for your use of the Service and for any information you
                                provide, including compliance with applicable laws, rules, and regulations, as well as
                                these Terms, including the User Conduct requirements outlined above.
                            </p>
                            <p className="text-lg mt-6 mb-2">Disclaimer of Warranties</p>
                            <p>
                                7.1. A-NFT.World is provided "as is" and without warranty of any kind. We make no
                                representations or warranties of any kind, express or implied, regarding the platform or
                                the content available on it.
                            </p>

                            <h2 className="text-lg mt-6 mb-2">Limitation of Liability</h2>

                            <p>
                                8.1. A-NFT.World shall not be liable for any direct, indirect, incidental, special,
                                consequential, or punitive damages arising out of or in any way connected with the use
                                of the platform.
                            </p>
                            <p className="text-lg mt-6 mb-2">Contact Us</p>
                            <p>
                                9.1. If you have any questions or concerns about these Terms of Service, please contact
                                us at the following link: https://discord.gg/7PFSgdvkn3.
                            </p>
                            <p className="text-lg mt-6 mb-2">Changes of terms</p>
                            <p>
                                10.1. A-NFT.World reserves the right to modify or update these Terms of Service at any
                                time without prior notice. Users are encouraged to review these terms periodically for
                                changes. By using A-NFT.World, you agree to be bound by the most current version of
                                these Terms of Service.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Terms;
