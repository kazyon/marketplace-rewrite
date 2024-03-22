import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { PropertiesIcon } from '@/shared/components/svgs/PropertiesIcon';
import { ItemProperties } from '@/sections/item/components/ItemProperties';

interface ItemsTabsProps {
    attributes: { trait_type: string; value: string }[];
}
export const ItemsTabs = ({ attributes }: ItemsTabsProps) => {
    const [tabsActive, setTabsActive] = useState(1);
    const tabsHeadText = [
        {
            id: 1,
            text: 'properties',
            icon: <PropertiesIcon className="icon mr-1 h-5 w-5 fill-current" />,
        },
    ];
    return (
        <>
            <div className="mt-14 overflow-x-auto rounded-lg">
                <Tabs className="min-w-fit tabs">
                    <TabList className="nav nav-tabs flex items-center">
                        {tabsHeadText.map(({ id, text, icon }) => {
                            return (
                                <Tab className="nav-item bg-transparent" key={id}>
                                    <button
                                        className={
                                            tabsActive === id
                                                ? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
                                                : 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
                                        }
                                        onClick={() => setTabsActive(id)}
                                    >
                                        {icon}
                                        <span className="font-display text-base font-medium">{text}</span>
                                    </button>
                                </Tab>
                            );
                        })}
                    </TabList>
                    <TabPanel>
                        <ItemProperties attributes={attributes} />
                    </TabPanel>
                    <TabPanel></TabPanel>
                </Tabs>
            </div>
        </>
    );
};
