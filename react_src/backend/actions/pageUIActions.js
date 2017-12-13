/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lancaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 *
 **/
import {
  CHANGE_AREA_STATE,
  SAVE_TEMPLATE,
  DELETE_TEMPLATE,
  FETCH_TEMPLATES
} from '../reducers/pageUIReducer';
import api from '../api';

const create = (type, payload, meta) => ({ type, payload, meta });

const createRequest = (
  payload,
  type,
  prom,
  mapRespToArgs = identity,
  onSuccess,
  onFail
) => (dispatch, getState) => {
  dispatch({ type: `${type}_REQUEST`, payload });
  return prom.then((resp) => {
    const response = mapRespToArgs(resp);
    dispatch({ type: `${type}_SUCCESS`, payload: response });
    onSuccess && onSuccess(dispatch, getState);
    return response;
  }).catch((err) => {
    dispatch({ type: `${type}_FAIL`, payload: err });
    onFail && onFail(dispatch, getState);
    return Promise.reject(err);
  });
};

export const fetchTemplates = () => createRequest(
  undefined,
  FETCH_TEMPLATES,
  api.get('component_templates'),
  response => response.data.map(
    ({ id, mpat_content, title = {} }) => ({ id, content: mpat_content, title: title.rendered })
  )
);

export const saveTemplate = (template, title) => createRequest(
  { template, title },
  SAVE_TEMPLATE,
  api.post('component_templates', { title, mpat_content: template, status: 'publish' }),
  response => response.data.id
);

export const deleteTemplate = id => createRequest(
  { id },
  DELETE_TEMPLATE,
  api.delete(`component_templates/${id}`),
  response => response.data.id,
  dispatch => dispatch(fetchTemplates())
);

export const changeAreaState = (areaId, stateId) => (
  create(CHANGE_AREA_STATE, stateId, areaId)
);
