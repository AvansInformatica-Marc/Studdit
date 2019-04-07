import { JsonObject } from "@peregrine/webserver"
import { SchemaTypes, Types } from "mongoose"
import { IConstructor } from "../../constructorType";

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
    return (target: IConstructor<any>) => {
        target.prototype.__entityName__ = name
    }
}

export function ID() {
    return (targetClass: JsonObject, fieldName: string) => {
        if (fieldName === "_id") {
            targetClass.__pk__ = fieldName
        } else {
            initField(targetClass, fieldName)
            targetClass.__schema__[fieldName].type = SchemaTypes.ObjectId
        }
    }
}

export function Field(type: StringConstructor | BooleanConstructor | Types.ObjectIdConstructor) {
    return (targetClass: JsonObject, fieldName: string) => {
        initField(targetClass, fieldName)
        let mongoType
        switch (type) {
            case String:
                mongoType = SchemaTypes.String
                break
            case Boolean:
                mongoType = SchemaTypes.Boolean
                break
            case Types.ObjectId:
                mongoType = SchemaTypes.ObjectId
                break
            default:
                throw new Error("Type not supported")
        }
        targetClass.__schema__[fieldName].type = mongoType
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