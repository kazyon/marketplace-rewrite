import React, { useState } from 'react';
import 'tippy.js/dist/tippy.css'; // optional
import 'react-tabs/style/react-tabs.css';
import CreateNfts from '@/sections/create/components/CreateNfts';
import { PriceIcon } from '@/shared/components/svgs/PriceIcon';
import { OwnedIcon } from '@/shared/components/svgs/OwnedIcon';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CreateCollection from '@/sections/create/components/CreateCollection';

export const CreateSection = () => {
    const [itemActive, setItemActive] = useState(1);

    const tabItem = [
        {
            id: 1,
            text: 'Collections',
            icon: <PriceIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
        {
            id: 2,
            text: 'NFTs',
            icon: <OwnedIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
    ];

    return (
        <Tabs className="tabs">
            <TabList className="nav nav-tabs mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b-0 border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
                {tabItem.map(({ id, text, icon }) => {
                    return (
                        <Tab className="nav-item" role="presentation" key={id} onClick={() => setItemActive(id)}>
                            <button
                                className={
                                    itemActive === id
                                        ? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
                                        : 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
                                }
                            >
                                {icon}
                                <span className="font-display text-base font-medium">{text}</span>
                            </button>
                        </Tab>
                    );
                })}
            </TabList>

            <TabPanel>
                <CreateCollection />
            </TabPanel>
            <TabPanel>
                <CreateNfts />
            </TabPanel>
        </Tabs>
    );
};
