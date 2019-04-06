import { JsonObject } from "@peregrine/webserver"
import { SchemaTypes, Types } from "mongoose"

function initField(targetClass: JsonObject, fieldName: string) {
    if (targetClass.__schema__ === undefined) {
        targetClass.__schema__ = {}
    }
    if (targetClass.__schema__[fieldName] === undefined) {
        targetClass.__schema__[fieldName] = {
            unique: false,
            required: false,
        }
    }

    return true
}

export function Entity(name: string) {
    return (target: { prototype: JsonObject }) => {
        target.prototype.__entityName__ = name
    }
}

export function ID() {
    return (targetClass: JsonObject, fieldName: string) => {
        initField(targetClass, fieldName)
        if (fieldName === "_id") {
            targetClass.__pk__ = fieldName
        } else {
            targetClass.__schema__[fieldName].type = SchemaTypes.ObjectId
        }
    }
}

export function Field(type: StringConstructor | Types.ObjectIdConstructor) {
    return (targetClass: JsonObject, fieldName: string) => {
        initField(targetClass, fieldName)
        targetClass.__schema__[fieldName].type = type === String ? SchemaTypes.String : SchemaTypes.ObjectId
    }
}

export function Required() {
    return (targetClass: JsonObject, fieldName: string) => {
        initField(targetClass, fieldName)
        targetClass.__schema__[fieldName].required = true
    }
}

export function Unique() {
    return (targetClass: JsonObject, fieldName: string) => {
        initField(targetClass, fieldName)
        targetClass.__schema__[fieldName].unique = true
    }
}