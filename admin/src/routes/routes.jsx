import React, { Suspense } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';

const RouterURL = withRouter(() => {
const DefaultContainer = () => ( 
    
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout >
                <Header />
                <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 50 }}>
                    <Route exact path="/dash-board">
                        <Suspense fallback={<LoadingScreen />}>
                            <DashBoard />
                        </Suspense>
                    </Route>

                    <Route exact path="/product-list">
                        <Suspense fallback={<LoadingScreen />}>
                            <ProductList />
                        </Suspense>
                    </Route>
                    <Route exact path="/category-list">
                        <Suspense fallback={<LoadingScreen />}>
                            <CategoryList />
                        </Suspense>
                    </Route>
                    
                    <Route exact path="/order-list">
                        <Suspense fallback={<LoadingScreen />}>
                            <OrderList />
                        </Suspense>
                    </Route>
                    
                    <Route exact path="/promotions-management">
                        <Suspense fallback={<LoadingScreen />}>
                            <PromotionsManagement />
                        </Suspense>
                    </Route>
                    
                    <Route exact path="/account-management">
                        <Suspense fallback={<LoadingScreen />}>
                            <AccountManagement />
                        </Suspense>
                    </Route>
                </Content>
                <Footer />
            </Layout>
        </Layout>
   
)

return (
    <div>
        <Router>
            <Switch>
                <Route exact path="/">
                    <LoginContainer />
                </Route>
                <Route exact path="/login">
                    <LoginContainer />
                </Route>
                <Route exact path="/news-list">
                    <DefaultContainer />
                </Route>
                <Route exact path="/reset-password/:id">
                    <LoginContainer />
                </Route>
                <Route exact path="/dash-board">
                    <DefaultContainer />
                </Route>
                <Route exact path="/change-password/:id">
                    <DefaultContainer />
                </Route>
                <Route exact path="/account-create">
                    <DefaultContainer />
                </Route>
                <Route exact path="/account-management">
                    <DefaultContainer />
                </Route>
                <Route exact path="/notification">
                    <DefaultContainer />
                </Route>
                <Route exact path="/product-list">
                    <DefaultContainer />
                </Route>
                <Route exact path="/category-list">
                    <DefaultContainer />
                </Route>
                <Route exact path="/profile">
                    <DefaultContainer />
                </Route>
                <Route exact path="/order-list">
                    <DefaultContainer />
                </Route>
                <Route exact path="/order-details/:id">
                    <DefaultContainer />
                </Route>
                <Route exact path="/suppliers">
                    <DefaultContainer />
                </Route>
                <Route exact path="/promotions-management">
                    <DefaultContainer />
                </Route>
                <Route exact path="/account-management">
                    <DefaultContainer />
                </Route>
                <Route exact path="/reset-password/:id">
                    <LoginContainer />
                </Route>
                <Route exact path="/chat">
                    <DefaultContainer />
                </Route>
                
            </Switch>
        </Router>
    </div>
)
})

export default RouterURL;