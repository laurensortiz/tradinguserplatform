import React, { Component } from 'react';
import { EditableProvider, EditableConsumer } from './editableContext';
import { Button, Input, Divider, Icon, Table, Form, Popconfirm } from 'antd';

const EditableRow = ({ form, index, ...props }) => (
  <EditableProvider value={ form }>
    <tr { ...props } />
  </EditableProvider>
);

export const EditableFormRow = Form.create()( EditableRow );

class EditableCell extends Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState( { editing }, () => {
      if (editing) {
        this.input.focus();
      }
    } );
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields( (error, values) => {
      if (error && error[ e.currentTarget.id ]) {
        return;
      }
      this.toggleEdit();
      handleSave( { ...record, ...values } );
    } );
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={ { margin: 0 } }>
        { form.getFieldDecorator( dataIndex, {
          rules: [
            {
              required: true,
              message: `${ title } is required.`,
            },
          ],
          initialValue: record[ dataIndex ],
        } )( <Input ref={ node => ( this.input = node ) } onPressEnter={ this.save } onBlur={ this.save }/> ) }
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={ { paddingRight: 24 } }
        onClick={ this.toggleEdit }
      >
        { children }
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;

    return (
      <td { ...restProps }>
        { editable ? (
          <EditableConsumer>{ this.renderCell }</EditableConsumer>
        ) : (
          children
        ) }
      </td>
    );
  }
}

export default EditableCell