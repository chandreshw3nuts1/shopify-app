import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";
import Cookies from 'js-cookie';

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;

  return json({ errors, polarisTranslations ,SHOPIFY_API_KEY});
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return json({
    errors,
  });
};
export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors, SHOPIFY_API_KEY } = actionData || loaderData;


  const storeName = Cookies.get('storeName');
  useEffect(() => {
    if (storeName) {
      window.location.href=`https://admin.shopify.com/store/${storeName}/oauth/install?client_id=${SHOPIFY_API_KEY}`;
    }
    
  }, [storeName]);

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      {/* <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Log in
              </Text>
              <TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors.shop}
              />
              <Button submit>Log in</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page> */}
    </PolarisAppProvider>
  );
}
