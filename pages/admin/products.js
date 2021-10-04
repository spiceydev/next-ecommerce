import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer } from 'react';
import Menu from '../../components/admin/Menu';
import Layout from '../../components/Layout';
import {
  CREATE_FAIL,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  DELETE_FAIL,
  DELETE_REQUEST,
  DELETE_RESET,
  DELETE_SUCCESS,
  FETCH_FAIL,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from '../../utils/actionTypes';
import { getError } from '../../utils/error';
import { makeCurrency } from '../../utils/makeCurrency';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: '' };
    case FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CREATE_REQUEST:
      return { ...state, loadingCreate: true };
    case CREATE_SUCCESS:
      return { ...state, loadingCreate: false };
    case CREATE_FAIL:
      return { ...state, loadingCreate: false };
    case DELETE_REQUEST:
      return { ...state, loadingDelete: true };
    case DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true };
    case DELETE_FAIL:
      return { ...state, loadingDelete: false };
    case DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;
  const { enqueueSnackbar } = useSnackbar();

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: FETCH_REQUEST });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: FETCH_FAIL, payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successDelete]);

  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    try {
      dispatch({ type: CREATE_REQUEST });
      const { data } = await axios.post(
        '/api/admin/products',
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(`data`, data);

      dispatch({ type: CREATE_SUCCESS });
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      router.push(`/admin/product/${data.product._id}`);
    } catch (error) {
      dispatch({ type: CREATE_FAIL });
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: DELETE_REQUEST });
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: DELETE_SUCCESS });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: DELETE_FAIL });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Products">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <Menu selected="products" />
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={createHandler}
                    >
                      Create Product
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{makeCurrency(product.price)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button
                                  size="small"
                                  color="primary"
                                  variant="contained"
                                >
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => deleteHandler(product._id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
