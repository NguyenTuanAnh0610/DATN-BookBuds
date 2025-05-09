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
import NotFound from './../components/notFound/notFound';
import LoadingScreen from "../components/loading/loadingScreen";
import ReviewsManagement from "../pages/Review/review";
import PromotionsManagement from "../pages/PromotionsManagement/promotionsManagement";
import OrderList from "../pages/OrderList/orderList";
import OrderDetail from "../pages/OrderDetail/OrderDetail";
import AccountManagement from './../pages/AccountManagement/accountManagement';



const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});
const RouterURL = withRouter(() => {
    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>

        </div>
    )
    const DefaultContainer = () => (

        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 50 }}>
                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>
                        
                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        <PrivateRoute exact path="/product-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <ProductList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/category-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <CategoryList />
                            </Suspense>
                        </PrivateRoute>
                        
                        <PrivateRoute exact path="/order-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderList />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/order-details/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderDetail />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/change-password/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <ChangePassword />
                            </Suspense>
                        </PrivateRoute>
                        
                        <PrivateRoute exact path="/promotions-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <PromotionsManagement />
                            </Suspense>
                        </PrivateRoute>
                        
                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>
                        
                        <PrivateRoute exact path="/chat">
                            <Suspense fallback={<LoadingScreen />}>
                                <Chat />
                            </Suspense>
                        </PrivateRoute>
                        <PrivateRoute exact path="/reviews">
                            <Suspense fallback={<LoadingScreen />}>
                                <ReviewsManagement />
                            </Suspense>
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >


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
                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/change-password/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/product-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/category-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-list">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/order-details/:id">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/promotions-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/chat">
                        <DefaultContainer />
                    </Route>
                    <Route exact path="/reviews">
                        <DefaultContainer />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;