import React, { FC } from 'react';
import { SubmitHandler, get, useFieldArray, useForm } from 'react-hook-form';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { renderInput, renderTextArea } from '../../utils/createForm';
import withCommonForm from '../../hoc/withCommonForm';
import { fetchNewArticle, fetchUpdateArticle } from '../../store/features/articles/articlesThunks';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { IArticleForm } from '../models/IArticle';
import { IArticleFormProps } from '../models/IForm';
import { useAppSelector } from '../../hooks/useAppSelector';

import styles from './ArticleForm.module.scss';

const defaultTagList = (tagList: string[] | null) => {
  if (!tagList) {
    return [{ name: 'tag0' }];
  } else {
    return (
      tagList &&
      tagList.map((item, index) => ({
        name: `tag${index}`,
        value: item,
      }))
    );
  }
};

const ArticleForm: FC<IArticleFormProps> = () => {
  const article = useAppSelector((state) => state.articles.article);
  const { slug } = useParams();

  const { title = '', description = '', body = '', tagList = null } = slug ? article ?? {} : {};

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IArticleForm>({
    defaultValues: {
      Title: title,
      description,
      Body: body,
      tagList: defaultTagList(tagList),
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'tagList',
    control,
  });

  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IArticleForm> = (data) => {
    const newTagList = data.tagList.map((_, index) => watch(`tagList.${index}.name`));
    if (slug) {
      dispatch(fetchUpdateArticle({ body: { ...data, tagList: newTagList }, slug })).then(() =>
        navigator('/')
      );
    } else {
      dispatch(fetchNewArticle({ body: { ...data, tagList: newTagList } })).then(() =>
        navigator('/')
      );
    }
  };

  const handleRemove = (index: number) => remove(index);
  const handleAppend = (index: number) => {
    append({ name: `tag${index + 1}` }, { focusName: `tag${index + 1}` });
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
          validate: (val: string) => {
            if (!val.trim()) {
              return 'Whitespaces are not allowed';
            }
            return null;
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
          validate: (val: string) => {
            if (!val.trim()) {
              return 'Whitespaces are not allowed';
            }
            return null;
          },
          maxLength: {
            value: 100,
            message: 'Description must be less than 100 symbols',
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
          validate: (val: string) => {
            if (!val.trim()) {
              return 'Whitespaces are not allowed';
            }
            return null;
          },
          maxLength: {
            value: 800,
            message: 'Text must be less than 800 symbols',
          },
        },
        `${styles['text-area']} ${errors?.Body?.message ? styles['error-border'] : ''}`
      )}

      <label htmlFor="tagList">
        Tags
        <ul className={styles['tag-list']}>
          {fields.map((item, index, array) => (
            <li key={item.id} className={styles.tag}>
              <div>
                <input
                  className={`${styles['tag-input']} ${
                    errors[`tag${index}` as keyof IArticleForm] ? styles['error-border'] : ''
                  }`}
                  type="text"
                  placeholder="Tag"
                  defaultValue={item.name}
                  {...register(`tagList.${index}.name` as const, {
                    required: 'This field required',
                    validate: (val: string): string | boolean => {
                      if (!val.trim()) {
                        return 'Whitespaces are not allowed';
                      }
                      return true;
                    },
                    maxLength: {
                      value: 50,
                      message: 'Tag must be less than 50 symbols',
                    },
                  })}
                />
                <div className={styles['tag-error']}>
                  {get(errors, `tagList.${index}.name`) && (
                    <p>{get(errors, `tagList.${index}.name`).message || 'Error'}</p>
                  )}
                </div>
              </div>

              {index > 0 && (
                <Button
                  className={styles['remove-btn']}
                  type="primary"
                  danger
                  onClick={() => handleRemove(index)}
                >
                  Delete
                </Button>
              )}

              {index === array.length - 1 && (
                <Button
                  type="primary"
                  className={styles['append-btn']}
                  onClick={() => handleAppend(index)}
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
};

export default withCommonForm(ArticleForm);
