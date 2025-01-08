import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  to={routeTo}
                  className={`ml-1 text-sm font-medium md:ml-2 ${
                    isLast
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};