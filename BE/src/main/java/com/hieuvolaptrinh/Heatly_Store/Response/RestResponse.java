package com.hieuvolaptrinh.Heatly_Store.Response;



import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestResponse<T> {
    private int status;
    private Object error;
    private Object message;
    private T data;

}
