import { FC, ReactNode } from "react";
import Header from "@/components/Header";

type TLayout = {
  children: ReactNode;
};

const Layout: FC<TLayout> = ({ children }): JSX.Element => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
