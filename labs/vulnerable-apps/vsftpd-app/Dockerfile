FROM alpine:latest
RUN apk add --no-cache python3 busybox-extras
COPY fake_vsftpd.py /fake_vsftpd.py
EXPOSE 21
EXPOSE 6200
CMD ["python3", "-u", "/fake_vsftpd.py"]
