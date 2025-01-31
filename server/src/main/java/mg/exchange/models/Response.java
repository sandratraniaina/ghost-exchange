package mg.exchange.models;

public class Response<T> {
    private int status;
    private boolean success;
    private String message;
    private T data;

    public Response() {

    }

    public Response(int status, boolean success, String message, T data) {
        this.setStatus(status);
        this.setSuccess(success);
        this.setMessage(message);
        this.setData(data);
    }
    
    public int getStatus() {
        return status;
    }
    public boolean isSuccess() {
        return success;
    }
    public String getMessage() {
        return message;
    }
    public T getData() {
        return data;
    }

    public void setStatus(int status) {
        this.status = status;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setData(T data) {
        this.data = data;
    }

    
}
