import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import EditProfileForm from '../components/EditProfileForm';
import { clearEdited } from '../store/features/user/userSlice';

function EditProfilePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearEdited());
  }, [dispatch]);
  return <EditProfileForm />;
}

export default EditProfilePage;
