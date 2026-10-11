import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import BackToTop from "@/components/base/BackToTop";
import FloatingButtons from "@/components/feature/FloatingButtons";
import ScrollManager from "@/components/base/ScrollManager";


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <ScrollManager />
        <AppRoutes />
        <BackToTop />
        <FloatingButtons />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
