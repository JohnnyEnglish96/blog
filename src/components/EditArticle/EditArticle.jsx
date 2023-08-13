/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-debugger */
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { renderInput, renderTextArea } from '../../utils/createInput';
import withCommonForm from '../../hoc/withCommonForm';
import { fetchUpdateArticle } from '../../store/features/articles/articlesThunks';

import styles from './EditArticle.module.scss';

const defaultTagList = (arr) => {
  return (
    arr &&
    arr.map((item, index) => ({
      name: `tag${index}`,
      value: item,
    }))
  );
};

function EditArticle() {
  const article = useSelector((state) => state.articles.article);
  const { title = '', description = '', body = '', tagList = '' } = article || {};

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      Title: title,
      description,
      Body: body,
      tagList: defaultTagList(tagList) || [{ name: 'tag0' }],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'tagList',
    control,
  });

  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const onSubmit = (data) => {
    const newTagList = data.tagList.map((tag) => watch(tag.name));
    dispatch(fetchUpdateArticle({ ...data, tagList: newTagList, slug })).then(() => navigator('/'));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {renderInput(
        'Title',
        'Title',
        'Title',
        register,
        errors,
        'text',
        {
          required: 'This field required',
          maxLength: {
            value: 30,
            message: 'Title must be less than 30 symbols',
          },
        },
        true
      )}

      {renderInput(
        'Short description',
        'description',
        'Title',
        register,
        errors,
        'text',
        {
          required: 'This field required',
          maxLength: {
            value: 30,
            message: 'Description must be less than 30 symbols',
          },
        },
        true
      )}

      {renderTextArea(
        'Text',
        'Body',
        'Text',
        register,
        errors,
        {
          required: 'This field required',
          maxLength: {
            value: 500,
            message: 'Text must be less than 500 symbols',
          },
        },
        `${styles['text-area']} ${errors?.Text?.message ? styles['error-border'] : ''}`
      )}

      <label htmlFor="tagList">
        Tags
        <ul className={styles['tag-list']}>
          {fields.map((item, index, array) => (
            <li key={item.id} className={styles.tag}>
              <div>
                <input
                  className={styles['tag-input']}
                  type="text"
                  placeholder="Tag"
                  defaultValue={item.value}
                  {...register(`tag${index}`, {
                    maxLength: {
                      value: 20,
                      message: 'Tag must be less than 20 symbols',
                    },
                  })}
                />
                <div className={styles['tag-error']}>
                  {errors[`tag${index}`] && <p>{errors[`tag${index}`].message || 'Error'}</p>}
                </div>
              </div>

              {index > 0 && (
                <Button
                  className={styles['remove-btn']}
                  type="primary"
                  danger
                  onClick={() => remove(index)}
                >
                  Delete
                </Button>
              )}

              {index === array.length - 1 && (
                <Button
                  type="primary"
                  className={styles['append-btn']}
                  onClick={() => {
                    append({ name: `tag${index + 1}` }, { focusName: `tag${index + 1}` });
                  }}
                >
                  Add tag
                </Button>
              )}
            </li>
          ))}
        </ul>
      </label>

      <Button
        type="primary"
        htmlType="submit"
        disabled={!isValid}
        style={{ height: 40, marginTop: 0 }}
      >
        Send
      </Button>
    </form>
  );
}

export default withCommonForm(EditArticle, { formTitle: 'Edit article' });
