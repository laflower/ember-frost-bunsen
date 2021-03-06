import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import PropTypesMixin, {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import layout from './template'
import {doesModelContainRequiredField, getLabel} from '../utils'

export default Ember.Component.extend(PropTypesMixin, {
  classNames: ['frost-bunsen-container-model'],
  layout,

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    label: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  readOnly: false,

  @readOnly
  @computed('cellConfig.container', 'store.view.containers')
  /**
   * Get definition for current container
   * @param {String} containerId - ID of current container
   * @param {BunsenContainer[]} containers - list of container definitions
   * @returns {BunsenContainer} current container definition
   */
  currentContainer: function (containerId, containers) {
    if (!containerId) {
      return null
    }

    containers = containers.filterBy('id', containerId)

    if (containers.length === 0) {
      return null
    }

    return containers[0]
  },

  @readOnly
  @computed('currentContainer')
  /**
   * Determine if current container can be collapsed
   * @param {BunsenContainer} container - current container
   * @returns {Boolean} whether or not container is collapsible
   */
  collapsible: function (container) {
    return container && container.collapsible
  },

  @readOnly
  @computed('currentContainer')
  /**
   * Get instructions text for current container
   * @param {BunsenContainer} container - current container
   * @returns {String} instructions text
   */
  instructions: function (container) {
    return container ? container.instructions : null
  },

  @readOnly
  @computed('bunsenId', 'cellConfig.label', 'label', 'model')
  /**
   * Get label for container
   * @param {String} bunsenId - bunsen ID for container in model
   * @param {String} configLabel - label defined in view
   * @param {String} label - label
   * @param {BunsenModel} model - bunsen model
   * @returns {String} label
   */
  renderLabel: function (bunsenId, configLabel, label, model) {
    label = label || configLabel
    return getLabel(label, model, bunsenId)
  },

  // TODO: figure out why we can't use @readOnly
  @computed('model')
  /**
   * Determine whether or not container contains required inputs
   * @param {BunsenModel} model - bunsen model for form
   * @returns {Boolean} whether or not container contains required inputs
   */
  isRequired: function (model) {
    return doesModelContainRequiredField(model)
  }
})
