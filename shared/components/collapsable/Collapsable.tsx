import React, { useState, createContext, useContext, PropsWithChildren } from 'react';

// Context for sharing state between Collapsable and its subcomponents
const CollapsableContext = createContext({
    isOpen: true,
    toggleOpen: () => {},
});

type ChildrenWithOptionalRenderProps = {
    children: React.ReactElement | ((isOpen: boolean) => React.ReactElement);
};

const Collapsable = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen(!isOpen);

    return <CollapsableContext.Provider value={{ isOpen, toggleOpen }}>{children}</CollapsableContext.Provider>;
};

Collapsable.Header = ({ children }: ChildrenWithOptionalRenderProps) => {
    const { toggleOpen, isOpen } = useContext(CollapsableContext);

    if (typeof children === 'function') {
        return <div onClick={toggleOpen}>{children(isOpen)}</div>;
    }
    return <div onClick={toggleOpen}>{children}</div>;
};

Collapsable.Content = ({ children }: PropsWithChildren) => {
    const { isOpen } = useContext(CollapsableContext);

    return <>{isOpen ? children : null}</>;
};

export default Collapsable;
