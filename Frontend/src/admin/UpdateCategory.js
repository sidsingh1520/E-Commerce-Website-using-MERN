import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {
  getCategories,
  getCategory,
  updateCategory
} from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper/index";

const UpdateCategory = ({ match }) => {
  const { user, token } = isAutheticated();

  const [values, setValues] = useState({
    name: "",
    loading: false,
    error: "",
    createdCategory: "",
    getaRedirect: false
  });

  const {
    name,
    loading,
    error,
    createdCategory,
    getaRedirect
  } = values;

  const preload = categoryId => {
    getCategory().then(data => {
      //console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        preloadCategories();
        setValues({
          ...values,
          name:data.name
        });
      }
    });
  };

  const preloadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          categories: data,
          formData: new FormData()
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  //TODO: work on it
  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateCategory(match.params.categoryId, user._id, token).then(
      data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            loading:false,
            createdCategory: data.name
          });
        }
      }
    );
  };

  const handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdCategory ? "" : "none" }}
    >
      <h4>{createdCategory} updated successfully</h4>
    </div>
  );

  const createCategoryForm = () => (
    <form>
            <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Category
      </button>
    </form>
  );

  return (
    <Base
      title="Update Category Here!"
      description="Welcome to category creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {createCategoryForm()}
        </div>
      </div>
    </Base>
  );
};
export default UpdateCategory;